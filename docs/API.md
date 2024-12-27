# Solana Oasis API Documentation

## Overview

The Solana Oasis API provides a comprehensive interface for developers to interact with the Layer 2 AI computation network. This document outlines all available endpoints, their usage, and example implementations.

## API Endpoints

### Base URLs
- Mainnet: `https://api.oasis.network`
- Testnet: `https://testnet-api.oasis.network`
- Local: `http://localhost:8899`

## 1. Node API

### 1.1 Health Check
```http
GET /v1/health
```

Response:
```json
{
    "status": "healthy",
    "version": "1.0.0",
    "timestamp": "2024-01-20T10:00:00Z"
}
```

### 1.2 Node Status
```http
GET /v1/node/status
```

Response:
```json
{
    "node_id": "node1",
    "uptime": 3600,
    "peers": 10,
    "sync_status": "synced",
    "last_block": 1234567
}
```

## 2. AI Computation API

### 2.1 Submit Computation
```http
POST /v1/compute
Content-Type: application/json

{
    "model_id": "gpt-4",
    "input": {
        "text": "Analyze this market data...",
        "context": {
            "market": "SOL/USD",
            "timeframe": "1h"
        }
    },
    "params": {
        "temperature": 0.7,
        "max_tokens": 100
    }
}
```

Response:
```json
{
    "computation_id": "comp_123456",
    "status": "processing",
    "estimated_time": 5
}
```

### 2.2 Get Computation Status
```http
GET /v1/compute/{computation_id}
```

Response:
```json
{
    "computation_id": "comp_123456",
    "status": "completed",
    "result": {
        "text": "Based on the market analysis...",
        "confidence": 0.95,
        "metadata": {
            "model_version": "1.0",
            "computation_time": 2.5
        }
    },
    "proof": {
        "merkle_proof": "0x...",
        "zk_proof": "0x..."
    }
}
```

## 3. State Management API

### 3.1 Get State Root
```http
GET /v1/state/root
```

Response:
```json
{
    "root": "0x...",
    "block_height": 1234567,
    "timestamp": "2024-01-20T10:00:00Z"
}
```

### 3.2 Submit State Update
```http
POST /v1/state/update
Content-Type: application/json

{
    "updates": [
        {
            "key": "0x...",
            "value": "0x...",
            "proof": "0x..."
        }
    ],
    "signature": "0x..."
}
```

## 4. Bridge API

### 4.1 Deposit Assets
```http
POST /v1/bridge/deposit
Content-Type: application/json

{
    "token": "SOL",
    "amount": "1.5",
    "destination": "0x...",
    "signature": "0x..."
}
```

### 4.2 Withdraw Assets
```http
POST /v1/bridge/withdraw
Content-Type: application/json

{
    "token": "SOL",
    "amount": "1.0",
    "destination": "0x...",
    "proof": "0x...",
    "signature": "0x..."
}
```

## 5. Model Registry API

### 5.1 List Available Models
```http
GET /v1/models
```

Response:
```json
{
    "models": [
        {
            "id": "gpt-4",
            "version": "1.0",
            "description": "Large language model",
            "capabilities": ["text", "analysis"],
            "pricing": {
                "token": "SOL",
                "price_per_request": "0.001"
            }
        }
    ]
}
```

### 5.2 Get Model Details
```http
GET /v1/models/{model_id}
```

## 6. SDK Examples

### 6.1 JavaScript/TypeScript SDK

```typescript
import { OasisSDK } from '@solana-oasis/sdk';

// Initialize SDK
const oasis = new OasisSDK({
    endpoint: 'https://api.oasis.network',
    wallet: solanaWallet
});

// Submit computation
async function computeExample() {
    const result = await oasis.compute({
        modelId: 'gpt-4',
        input: {
            text: 'Analyze market trends...',
            context: {
                market: 'SOL/USD'
            }
        },
        params: {
            temperature: 0.7
        }
    });
    
    console.log('Computation result:', result);
}

// Bridge interaction
async function bridgeExample() {
    // Deposit SOL to L2
    const deposit = await oasis.bridge.deposit({
        token: 'SOL',
        amount: '1.5'
    });
    
    // Wait for confirmation
    await deposit.wait();
}
```

### 6.2 Python SDK

```python
from solana_oasis import OasisSDK

# Initialize SDK
oasis = OasisSDK(
    endpoint='https://api.oasis.network',
    wallet=solana_wallet
)

# Submit computation
async def compute_example():
    result = await oasis.compute(
        model_id='gpt-4',
        input={
            'text': 'Analyze market trends...',
            'context': {
                'market': 'SOL/USD'
            }
        },
        params={
            'temperature': 0.7
        }
    )
    
    print('Computation result:', result)

# Bridge interaction
async def bridge_example():
    # Deposit SOL to L2
    deposit = await oasis.bridge.deposit(
        token='SOL',
        amount='1.5'
    )
    
    # Wait for confirmation
    await deposit.wait()
```

### 6.3 Rust SDK

```rust
use solana_oasis::OasisSDK;

// Initialize SDK
let oasis = OasisSDK::new(
    "https://api.oasis.network",
    solana_wallet
)?;

// Submit computation
async fn compute_example() -> Result<(), Error> {
    let result = oasis.compute(ComputeParams {
        model_id: "gpt-4",
        input: ComputeInput {
            text: "Analyze market trends...",
            context: json!({
                "market": "SOL/USD"
            })
        },
        params: ComputeParams {
            temperature: 0.7
        }
    }).await?;
    
    println!("Computation result: {:?}", result);
    Ok(())
}

// Bridge interaction
async fn bridge_example() -> Result<(), Error> {
    // Deposit SOL to L2
    let deposit = oasis.bridge.deposit(DepositParams {
        token: "SOL",
        amount: "1.5"
    }).await?;
    
    // Wait for confirmation
    deposit.wait().await?;
    Ok(())
}
```

## 7. WebSocket API

### 7.1 Connect to WebSocket
```javascript
const ws = new WebSocket('wss://api.oasis.network/v1/ws');

ws.onopen = () => {
    console.log('Connected to Oasis WebSocket');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
};
```

### 7.2 Subscribe to Updates
```json
{
    "type": "subscribe",
    "channel": "computations",
    "params": {
        "computation_id": "comp_123456"
    }
}
```

## 8. Error Handling

### 8.1 Error Codes
```typescript
enum ErrorCode {
    // General errors (1xxx)
    INVALID_REQUEST = 1000,
    UNAUTHORIZED = 1001,
    RATE_LIMITED = 1002,
    
    // Computation errors (2xxx)
    COMPUTATION_FAILED = 2000,
    MODEL_NOT_FOUND = 2001,
    INVALID_INPUT = 2002,
    
    // Bridge errors (3xxx)
    INSUFFICIENT_FUNDS = 3000,
    INVALID_PROOF = 3001,
    BRIDGE_PAUSED = 3002
}
```

### 8.2 Error Response Format
```json
{
    "error": {
        "code": 1000,
        "message": "Invalid request parameters",
        "details": {
            "field": "amount",
            "reason": "Must be positive"
        }
    }
}
```

## 9. Rate Limits

- Public API: 100 requests per minute
- Authenticated API: 1000 requests per minute
- Computation API: Varies by model and subscription tier
- WebSocket: 10 subscriptions per connection

## 10. Authentication

### 10.1 API Key Authentication
```http
POST /v1/compute
Authorization: Bearer YOUR_API_KEY
```

### 10.2 Wallet Authentication
```typescript
const signature = await wallet.signMessage(message);
const auth = await oasis.authenticate(signature);
```

## 11. Versioning

The API follows semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes
- MINOR: New features, backward compatible
- PATCH: Bug fixes, backward compatible

Current version: 1.0.0 