import torch
import torch.nn as nn
import json
import os

# Simple test model
class TestModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = nn.Linear(3, 1)
    
    def forward(self, x):
        return self.linear(x)

def create_test_model(output_dir):
    # Create model
    model = TestModel()
    
    # Save model
    model_path = os.path.join(output_dir, "test_model")
    os.makedirs(model_path, exist_ok=True)
    
    # Save PyTorch model
    torch.save(model.state_dict(), os.path.join(model_path, "model.pt"))
    
    # Create metadata
    metadata = {
        "id": "test_model",
        "version": "1.0.0",
        "model_type": "PyTorch",
        "input_shape": [1, 3],
        "output_shape": [1, 1],
        "description": "Simple test model for Solana Oasis",
        "parameters": {}
    }
    
    # Save metadata
    with open(os.path.join(model_path, "metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

if __name__ == "__main__":
    import sys
    if len(sys.argv) != 2:
        print("Usage: python test_model.py <output_dir>")
        sys.exit(1)
    
    create_test_model(sys.argv[1]) 