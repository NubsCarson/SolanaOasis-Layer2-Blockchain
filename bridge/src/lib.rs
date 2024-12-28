use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BridgeError {
    #[error("Failed to process bridge request")]
    ProcessingError,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    _program_id: &Pubkey,
    _accounts: &[AccountInfo],
    _instruction_data: &[u8],
) -> ProgramResult {
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process_instruction() {
        let program_id = Pubkey::new_unique();
        let accounts = vec![];
        let instruction_data = vec![];
        assert!(process_instruction(&program_id, &accounts, &instruction_data).is_ok());
    }
}
