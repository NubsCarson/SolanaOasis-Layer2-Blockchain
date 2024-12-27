use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};
use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
};

#[program]
pub mod oasis_bridge {
    use super::*;

    pub fn initialize_bridge(
        ctx: Context<InitializeBridge>,
        params: InitializeBridgeParams,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        bridge.authority = ctx.accounts.authority.key();
        bridge.paused = false;
        bridge.withdrawal_nonce = 0;
        bridge.min_withdrawal = params.min_withdrawal;
        bridge.max_withdrawal = params.max_withdrawal;
        bridge.daily_limit = params.daily_limit;
        bridge.total_locked = 0;
        Ok(())
    }

    pub fn deposit(
        ctx: Context<Deposit>,
        amount: u64,
        l2_recipient: [u8; 32],
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        
        // Verify bridge is not paused
        require!(!bridge.paused, BridgeError::BridgePaused);

        // Transfer tokens to bridge vault
        let cpi_accounts = token::Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.vault.to_account_info(),
            authority: ctx.accounts.depositor.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Update bridge state
        bridge.total_locked = bridge.total_locked.checked_add(amount)
            .ok_or(BridgeError::Overflow)?;

        emit!(DepositEvent {
            depositor: ctx.accounts.depositor.key(),
            amount,
            l2_recipient,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
        proof: WithdrawalProof,
    ) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        
        // Verify bridge is not paused
        require!(!bridge.paused, BridgeError::BridgePaused);

        // Verify withdrawal limits
        require!(
            amount >= bridge.min_withdrawal,
            BridgeError::WithdrawalTooSmall
        );
        require!(
            amount <= bridge.max_withdrawal,
            BridgeError::WithdrawalTooLarge
        );

        // Verify proof
        // TODO: Implement withdrawal proof verification
        
        // Verify daily limit
        // TODO: Implement daily limit tracking

        // Transfer tokens from bridge vault
        let seeds = &[
            b"bridge".as_ref(),
            &[bridge.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = token::Transfer {
            from: ctx.accounts.vault.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: bridge.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        // Update bridge state
        bridge.total_locked = bridge.total_locked.checked_sub(amount)
            .ok_or(BridgeError::Overflow)?;
        bridge.withdrawal_nonce = bridge.withdrawal_nonce.checked_add(1)
            .ok_or(BridgeError::Overflow)?;

        emit!(WithdrawEvent {
            recipient: ctx.accounts.recipient.key(),
            amount,
            nonce: bridge.withdrawal_nonce,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn pause_bridge(ctx: Context<PauseBridge>) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        
        // Only authority can pause
        require!(
            ctx.accounts.authority.key() == bridge.authority,
            BridgeError::UnauthorizedOperation
        );

        bridge.paused = true;

        emit!(BridgePaused {
            authority: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn unpause_bridge(ctx: Context<UnpauseBridge>) -> Result<()> {
        let bridge = &mut ctx.accounts.bridge;
        
        // Only authority can unpause
        require!(
            ctx.accounts.authority.key() == bridge.authority,
            BridgeError::UnauthorizedOperation
        );

        bridge.paused = false;

        emit!(BridgeUnpaused {
            authority: ctx.accounts.authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeBridge<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + BridgeAccount::LEN,
        seeds = [b"bridge"],
        bump
    )]
    pub bridge: Account<'info, BridgeAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub bridge: Account<'info, BridgeAccount>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    pub depositor: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub bridge: Account<'info, BridgeAccount>,
    #[account(mut)]
    pub vault: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub recipient: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PauseBridge<'info> {
    #[account(mut)]
    pub bridge: Account<'info, BridgeAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UnpauseBridge<'info> {
    #[account(mut)]
    pub bridge: Account<'info, BridgeAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct BridgeAccount {
    pub authority: Pubkey,
    pub paused: bool,
    pub withdrawal_nonce: u64,
    pub min_withdrawal: u64,
    pub max_withdrawal: u64,
    pub daily_limit: u64,
    pub total_locked: u64,
    pub bump: u8,
}

impl BridgeAccount {
    pub const LEN: usize = 32 + // authority
        1 + // paused
        8 + // withdrawal_nonce
        8 + // min_withdrawal
        8 + // max_withdrawal
        8 + // daily_limit
        8 + // total_locked
        1; // bump
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeBridgeParams {
    pub min_withdrawal: u64,
    pub max_withdrawal: u64,
    pub daily_limit: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct WithdrawalProof {
    pub l2_block_number: u64,
    pub merkle_proof: Vec<[u8; 32]>,
    pub withdrawal_hash: [u8; 32],
}

#[event]
pub struct DepositEvent {
    pub depositor: Pubkey,
    pub amount: u64,
    pub l2_recipient: [u8; 32],
    pub timestamp: i64,
}

#[event]
pub struct WithdrawEvent {
    pub recipient: Pubkey,
    pub amount: u64,
    pub nonce: u64,
    pub timestamp: i64,
}

#[event]
pub struct BridgePaused {
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct BridgeUnpaused {
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum BridgeError {
    #[msg("Bridge is paused")]
    BridgePaused,
    #[msg("Withdrawal amount too small")]
    WithdrawalTooSmall,
    #[msg("Withdrawal amount too large")]
    WithdrawalTooLarge,
    #[msg("Daily withdrawal limit exceeded")]
    DailyLimitExceeded,
    #[msg("Invalid withdrawal proof")]
    InvalidProof,
    #[msg("Unauthorized operation")]
    UnauthorizedOperation,
    #[msg("Arithmetic overflow")]
    Overflow,
} 