use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};
use solana_program::{
    program_error::ProgramError,
    pubkey::Pubkey,
};

declare_id!("Oasis111111111111111111111111111111111111111");

#[program]
pub mod solana_oasis {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, params: InitializeParams) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.validators = Vec::new();
        state.state_root = [0u8; 32];
        state.last_update = Clock::get()?.unix_timestamp;
        state.challenge_period = params.challenge_period;
        state.min_stake = params.min_stake;
        Ok(())
    }

    pub fn update_state_root(
        ctx: Context<UpdateStateRoot>,
        new_root: [u8; 32],
        proof: Vec<u8>,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let clock = Clock::get()?;

        // Verify the validator is authorized
        require!(
            state.validators.contains(&ctx.accounts.validator.key()),
            OasisError::UnauthorizedValidator
        );

        // Verify the proof
        // TODO: Implement proof verification
        
        // Update state root
        state.state_root = new_root;
        state.last_update = clock.unix_timestamp;

        emit!(StateRootUpdated {
            previous_root: state.state_root,
            new_root,
            timestamp: clock.unix_timestamp,
            validator: ctx.accounts.validator.key(),
        });

        Ok(())
    }

    pub fn register_validator(
        ctx: Context<RegisterValidator>,
        stake_amount: u64,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;

        // Verify minimum stake
        require!(
            stake_amount >= state.min_stake,
            OasisError::InsufficientStake
        );

        // Transfer stake
        let cpi_accounts = token::Transfer {
            from: ctx.accounts.stake_from.to_account_info(),
            to: ctx.accounts.stake_vault.to_account_info(),
            authority: ctx.accounts.validator.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, stake_amount)?;

        // Register validator
        state.validators.push(ctx.accounts.validator.key());

        emit!(ValidatorRegistered {
            validator: ctx.accounts.validator.key(),
            stake_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn submit_fraud_proof(
        ctx: Context<SubmitFraudProof>,
        proof_data: Vec<u8>,
    ) -> Result<()> {
        let state = &ctx.accounts.state;
        let clock = Clock::get()?;

        // Verify the challenge period hasn't expired
        require!(
            clock.unix_timestamp <= state.last_update + state.challenge_period,
            OasisError::ChallengePeriodExpired
        );

        // Verify the proof
        // TODO: Implement fraud proof verification

        // If valid, slash the validator and revert state
        // TODO: Implement slashing and state reversion

        emit!(FraudProofSubmitted {
            challenger: ctx.accounts.challenger.key(),
            proof_data,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + StateAccount::LEN
    )]
    pub state: Account<'info, StateAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateStateRoot<'info> {
    #[account(mut)]
    pub state: Account<'info, StateAccount>,
    pub validator: Signer<'info>,
}

#[derive(Accounts)]
pub struct RegisterValidator<'info> {
    #[account(mut)]
    pub state: Account<'info, StateAccount>,
    pub validator: Signer<'info>,
    #[account(mut)]
    pub stake_from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub stake_vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SubmitFraudProof<'info> {
    #[account(mut)]
    pub state: Account<'info, StateAccount>,
    pub challenger: Signer<'info>,
}

#[account]
pub struct StateAccount {
    pub authority: Pubkey,
    pub validators: Vec<Pubkey>,
    pub state_root: [u8; 32],
    pub last_update: i64,
    pub challenge_period: i64,
    pub min_stake: u64,
}

impl StateAccount {
    pub const LEN: usize = 32 + // authority
        4 + (32 * 100) + // validators (max 100)
        32 + // state_root
        8 + // last_update
        8 + // challenge_period
        8; // min_stake
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {
    pub challenge_period: i64,
    pub min_stake: u64,
}

#[event]
pub struct StateRootUpdated {
    pub previous_root: [u8; 32],
    pub new_root: [u8; 32],
    pub timestamp: i64,
    pub validator: Pubkey,
}

#[event]
pub struct ValidatorRegistered {
    pub validator: Pubkey,
    pub stake_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct FraudProofSubmitted {
    pub challenger: Pubkey,
    pub proof_data: Vec<u8>,
    pub timestamp: i64,
}

#[error_code]
pub enum OasisError {
    #[msg("Validator is not authorized")]
    UnauthorizedValidator,
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    #[msg("Challenge period has expired")]
    ChallengePeriodExpired,
    #[msg("Invalid state transition proof")]
    InvalidStateProof,
    #[msg("Invalid fraud proof")]
    InvalidFraudProof,
} 