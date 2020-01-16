var request = require('request');
//使用web3模块
var Web3 = require('web3')

// const express = require('express')
// const app = express()
//
// app.get('/', (req, res) => res.send('Hello World!'))
//
// app.listen(3000, () => console.log('Example app listening on port 3000!'))

//创建web3实例，并连接私有链（假设私有链监听8545端口）
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:16000"));


var lk = {
    from: "0xf3a8e024dd9e17a710c9f7f134bf607c28c90de6",
    to: "0x492c4186c37549ab76599188bcf6aa8c82388888",
    pwd: "your pwd",
    gasPrice: '0x174876e800',
    eth_getTransactionCount: function (account) {
        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_getTransactionCount",
            "params": [account, "latest"]
        })
    },
    eth_blockNumber: function () {
        return ajax({"jsonrpc": "2.0", "id": "0", "method": "eth_blockNumber", "params": []})
    },
    eth_estimateGas: function (from, to, value) {
        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_estimateGas",
            "params": [{
                "from": from,
                "to": to,
                "value": value
            }]
        })
    },

    eth_signTransaction: async function (from, to, value) {

        var gas = await this.eth_estimateGas(from, to, value)
        console.log("gas", gas.result)
        var nonce = await this.eth_getTransactionCount(from)

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_signTransaction",
            "params": [{
                "from": from,
                "to": to,
                "gas": gas.result,
                "gasPrice": this.gasPrice,
                "value": value,
                "nonce": nonce.result
            }]
        })
    },
    personal_unlockAccount: function (from) {
        return ajax({
            "jsonrpc": "2.0",
            "method": "personal_unlockAccount",
            "params": [from, this.pwd, 3600],
            "id": 67
        })
    },
    personal_sendTransaction: async function (from, to, value) {
        await this.personal_unlockAccount(from);
        var result = await this.eth_signTransaction(from, to, value);

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "personal_sendTransaction",
            "params": [{
                "from": from,
                "to": to,
                "value": value
            }, this.pwd]
        })
    },


}

var contract = {

    from: "0xf3a8e024dd9e17a710c9f7f134bf607c28c90de6",
    pwd: "your pwd",
    gasPrice: '0x174876e800',
    oneLk: "1000000000000000000",
    byteCode: {
        "linkReferences": {},
        "object": "608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506106fc806100616000396000f3fe608060405260043610610078576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d1461007d5780634a562885146100ab5780638da5cb5b146100d9578063915eb32f1461013057806392d0d153146101f5578063bec082bb14610220575b600080fd5b6100a96004803603602081101561009357600080fd5b810190808035906020019092919050505061026e565b005b6100d7600480360360208110156100c157600080fd5b81019080803590602001909291905050506103cb565b005b3480156100e557600080fd5b506100ee61048d565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101f36004803603604081101561014657600080fd5b81019080803590602001909291908035906020019064010000000081111561016d57600080fd5b82018360208201111561017f57600080fd5b803590602001918460018302840111640100000000831117156101a157600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506104b3565b005b34801561020157600080fd5b5061020a61058e565b6040518082815260200191505060405180910390f35b61026c6004803603604081101561023657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610594565b005b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102ca57600080fd5b60003073ffffffffffffffffffffffffffffffffffffffff1631905080821115151561035e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f62616c616e6365206e6f7420656e6f756768000000000000000000000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156103c6573d6000803e3d6000fd5b505050565b600181111515610443576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600c8152602001807f696e76616c6964206261636b000000000000000000000000000000000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610489573d6000803e3d6000fd5b5050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b816000819055507f64a2cb2f4618d2a9a1b9cf17f12149c8c583b543ad49f160dd542b47d9c560073382604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561054f578082015181840152602081019050610534565b50505050905090810190601f16801561057c5780820380516001836020036101000a031916815260200191505b50935050505060405180910390a15050565b60005481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156105f057600080fd5b60003073ffffffffffffffffffffffffffffffffffffffff16319050808211151515610684576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f62616c616e6365206e6f7420656e6f756768000000000000000000000000000081525060200191505060405180910390fd5b8273ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156106ca573d6000803e3d6000fd5b5050505056fea165627a7a723058207c2e6634c1d59e4da7f7ba20940df98ce67a308aa33bf1ea98862719a475f5e50029",
        "opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0x10 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP CALLER PUSH1 0x1 PUSH1 0x0 PUSH2 0x100 EXP DUP2 SLOAD DUP2 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF MUL NOT AND SWAP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND MUL OR SWAP1 SSTORE POP PUSH2 0x6FC DUP1 PUSH2 0x61 PUSH1 0x0 CODECOPY PUSH1 0x0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x78 JUMPI PUSH1 0x0 CALLDATALOAD PUSH29 0x100000000000000000000000000000000000000000000000000000000 SWAP1 DIV PUSH4 0xFFFFFFFF AND DUP1 PUSH4 0x2E1A7D4D EQ PUSH2 0x7D JUMPI DUP1 PUSH4 0x4A562885 EQ PUSH2 0xAB JUMPI DUP1 PUSH4 0x8DA5CB5B EQ PUSH2 0xD9 JUMPI DUP1 PUSH4 0x915EB32F EQ PUSH2 0x130 JUMPI DUP1 PUSH4 0x92D0D153 EQ PUSH2 0x1F5 JUMPI DUP1 PUSH4 0xBEC082BB EQ PUSH2 0x220 JUMPI JUMPDEST PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH2 0xA9 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0x93 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x26E JUMP JUMPDEST STOP JUMPDEST PUSH2 0xD7 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x20 DUP2 LT ISZERO PUSH2 0xC1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x3CB JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xE5 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0xEE PUSH2 0x48D JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x1F3 PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0x146 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 PUSH5 0x100000000 DUP2 GT ISZERO PUSH2 0x16D JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP3 ADD DUP4 PUSH1 0x20 DUP3 ADD GT ISZERO PUSH2 0x17F JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP2 DUP5 PUSH1 0x1 DUP4 MUL DUP5 ADD GT PUSH5 0x100000000 DUP4 GT OR ISZERO PUSH2 0x1A1 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST SWAP2 SWAP1 DUP1 DUP1 PUSH1 0x1F ADD PUSH1 0x20 DUP1 SWAP2 DIV MUL PUSH1 0x20 ADD PUSH1 0x40 MLOAD SWAP1 DUP2 ADD PUSH1 0x40 MSTORE DUP1 SWAP4 SWAP3 SWAP2 SWAP1 DUP2 DUP2 MSTORE PUSH1 0x20 ADD DUP4 DUP4 DUP1 DUP3 DUP5 CALLDATACOPY PUSH1 0x0 DUP2 DUP5 ADD MSTORE PUSH1 0x1F NOT PUSH1 0x1F DUP3 ADD AND SWAP1 POP DUP1 DUP4 ADD SWAP3 POP POP POP POP POP POP POP SWAP2 SWAP3 SWAP2 SWAP3 SWAP1 POP POP POP PUSH2 0x4B3 JUMP JUMPDEST STOP JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x201 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST POP PUSH2 0x20A PUSH2 0x58E JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 DUP3 DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST PUSH2 0x26C PUSH1 0x4 DUP1 CALLDATASIZE SUB PUSH1 0x40 DUP2 LT ISZERO PUSH2 0x236 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST DUP2 ADD SWAP1 DUP1 DUP1 CALLDATALOAD PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 DUP1 CALLDATALOAD SWAP1 PUSH1 0x20 ADD SWAP1 SWAP3 SWAP2 SWAP1 POP POP POP PUSH2 0x594 JUMP JUMPDEST STOP JUMPDEST PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO ISZERO PUSH2 0x2CA JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND BALANCE SWAP1 POP DUP1 DUP3 GT ISZERO ISZERO ISZERO PUSH2 0x35E JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x12 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x62616C616E6365206E6F7420656E6F7567680000000000000000000000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x8FC DUP4 SWAP1 DUP2 ISZERO MUL SWAP1 PUSH1 0x40 MLOAD PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP9 CALL SWAP4 POP POP POP POP ISZERO DUP1 ISZERO PUSH2 0x3C6 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP JUMP JUMPDEST PUSH1 0x1 DUP2 GT ISZERO ISZERO PUSH2 0x443 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0xC DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x696E76616C6964206261636B0000000000000000000000000000000000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x8FC DUP3 SWAP1 DUP2 ISZERO MUL SWAP1 PUSH1 0x40 MLOAD PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP9 CALL SWAP4 POP POP POP POP ISZERO DUP1 ISZERO PUSH2 0x489 JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP JUMP JUMPDEST PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 JUMP JUMPDEST DUP2 PUSH1 0x0 DUP2 SWAP1 SSTORE POP PUSH32 0x64A2CB2F4618D2A9A1B9CF17F12149C8C583B543AD49F160DD542B47D9C56007 CALLER DUP3 PUSH1 0x40 MLOAD DUP1 DUP4 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE DUP4 DUP2 DUP2 MLOAD DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP DUP1 MLOAD SWAP1 PUSH1 0x20 ADD SWAP1 DUP1 DUP4 DUP4 PUSH1 0x0 JUMPDEST DUP4 DUP2 LT ISZERO PUSH2 0x54F JUMPI DUP1 DUP3 ADD MLOAD DUP2 DUP5 ADD MSTORE PUSH1 0x20 DUP2 ADD SWAP1 POP PUSH2 0x534 JUMP JUMPDEST POP POP POP POP SWAP1 POP SWAP1 DUP2 ADD SWAP1 PUSH1 0x1F AND DUP1 ISZERO PUSH2 0x57C JUMPI DUP1 DUP3 SUB DUP1 MLOAD PUSH1 0x1 DUP4 PUSH1 0x20 SUB PUSH2 0x100 EXP SUB NOT AND DUP2 MSTORE PUSH1 0x20 ADD SWAP2 POP JUMPDEST POP SWAP4 POP POP POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG1 POP POP JUMP JUMPDEST PUSH1 0x0 SLOAD DUP2 JUMP JUMPDEST PUSH1 0x1 PUSH1 0x0 SWAP1 SLOAD SWAP1 PUSH2 0x100 EXP SWAP1 DIV PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND EQ ISZERO ISZERO PUSH2 0x5F0 JUMPI PUSH1 0x0 DUP1 REVERT JUMPDEST PUSH1 0x0 ADDRESS PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND BALANCE SWAP1 POP DUP1 DUP3 GT ISZERO ISZERO ISZERO PUSH2 0x684 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD DUP1 DUP1 PUSH1 0x20 ADD DUP3 DUP2 SUB DUP3 MSTORE PUSH1 0x12 DUP2 MSTORE PUSH1 0x20 ADD DUP1 PUSH32 0x62616C616E6365206E6F7420656E6F7567680000000000000000000000000000 DUP2 MSTORE POP PUSH1 0x20 ADD SWAP2 POP POP PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST DUP3 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x8FC DUP4 SWAP1 DUP2 ISZERO MUL SWAP1 PUSH1 0x40 MLOAD PUSH1 0x0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP9 CALL SWAP4 POP POP POP POP ISZERO DUP1 ISZERO PUSH2 0x6CA JUMPI RETURNDATASIZE PUSH1 0x0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH1 0x0 REVERT JUMPDEST POP POP POP POP JUMP INVALID LOG1 PUSH6 0x627A7A723058 KECCAK256 PUSH29 0x2E6634C1D59E4DA7F7BA20940DF98CE67A308AA33BF1EA98862719A475 CREATE2 0xe5 STOP 0x29 ",
        "sourceMap": "27:1106:0:-;;;108:58;8:9:-1;5:2;;;30:1;27;20:12;5:2;108:58:0;148:10;140:5;;:18;;;;;;;;;;;;;;;;;;27:1106;;;;;;"
    },
    abi: [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "withdraw",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "back",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_t",
                    "type": "uint256"
                },
                {
                    "name": "orderId",
                    "type": "string"
                }
            ],
            "name": "bet",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "t",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "other",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferToOther",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "orderId",
                    "type": "string"
                }
            ],
            "name": "event_bet",
            "type": "event"
        }
    ],
    //解锁
    personal_unlockAccount: function (from) {
        return ajax({
            "jsonrpc": "2.0",
            "method": "personal_unlockAccount",
            "params": [from, this.pwd, 3600],
            "id": 67
        })
    },
    //次数
    eth_getTransactionCount: function (account) {
        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_getTransactionCount",
            "params": [account, "latest"]
        })
    },
    //gas
    eth_estimateGas: function (from, byteCode) {
        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_estimateGas",
            "params": [{
                "from": from,

                "value": "0x0",
                "data": byteCode
            }]
        })
    },
    //签名
    eth_signTransaction: async function (from, byteCode, value) {
        var nonce = await this.eth_getTransactionCount(from)

        var gas = await this.eth_estimateGas(from, byteCode, value)
        console.log("gas", gas.result)

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_signTransaction",
            "params": [{
                "from": from,
                //    "to": to,
                "data": byteCode,
                "gas": gas.result,
                "gasPrice": this.gasPrice,
                "value": value,
                "nonce": nonce.result
            }]
        })
    },
    //部署发送合约
    eth_sendRawTransaction: async function (from, byteCode, value) {
        await this.personal_unlockAccount(from);
        var sign = await this.eth_signTransaction(from, byteCode, value);

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_sendRawTransaction",
            "params": [sign.result.raw]
        })

    },

    //签名 执行合约
    eth_signTransaction_exec: async function (from, to, value, data) {

        var gas = await this.eth_estimateGas_exec(from, to, value, data)
        console.log("gas", gas.result)
        var nonce = await this.eth_getTransactionCount(from)

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_signTransaction",
            "params": [{
                "from": from,
                "to": to,
                "gas": gas.result,
                "gasPrice": this.gasPrice,
                "value": value,
                "nonce": nonce.result,
                "data": data
            }]
        })
    },

    //gas 执行合约
    eth_estimateGas_exec: function (from, to, value, data) {
        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_estimateGas",
            "params": [{
                "from": from,
                "to": to,
                "value": value,
                "data": data
            }]
        })
    },
    //100000000000000000 1链克
    //发送合约交易 执行合约
    eth_sendRawTransaction_exec: async function (from, to, data) {
        await this.personal_unlockAccount(from);
        var sign = await this.eth_signTransaction_exec(from, to, '0xde0b6b3a7640000', data);

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_sendRawTransaction",
            "params": [sign.result.raw]
        })
    },
    app_awake: async function (from, to, data, value) {
        value = web3.utils.toHex(value)

        var gas = await this.eth_estimateGas_exec(from, to, value, data)
        var tx = {
            to: to,
            data: data,
            value: web3.utils.hexToNumberString(value), //10进制
            gas: web3.utils.hexToNumberString(gas.result),
            desc: encodeURI("tang娃娃起飞"),
            callback: encodeURI("http://www.ltk100.vip/shop/contract"),
            cbData: encodeURI("123")
        }

        return "ptitlubancommon://contract?to=" + tx.to + "&data=" + tx.data + "&value=" + tx.value + "&gas=" + tx.gas
            + "&desc=" + tx.desc + "&callback=" + tx.callback + "&cbData=" + tx.cbData
    },
    // 根据hash查询交易
    eth_getTransactionReceipt: async function (hash) {

        return ajax({
            "jsonrpc": "2.0",
            "id": "0",
            "method": "eth_getTransactionReceipt",
            "params": [hash]
        })

    },
    contractAddress: "0xdaa147be3b3e299c4fbfd1cb3cf7f92f22e961b0",
    hash: "0x5cef393db7e9c8b206e9b69a8771c177d2945cd75c09fd28d7bbc03ce9dfd6de",

    txHash: "0xdec5b26dbb7b4fd52dcf6a5bf276d9becca5f533364108d69c7da51938ebbcbd"

}

async function test() {
    // 区块高度
    // lk.personal_sendTransaction(lk.from, lk.to, '0x1')

    console.log("=====================================================\n")

    //合约部署
       contract.eth_sendRawTransaction(contract.from, "0x" + contract.byteCode.object, "0x0")
    //合约查询
    //    contract.eth_getTransactionReceipt(contract.txHash)



}


test()


function ajax(data) {
    // var data={"jsonrpc":"2.0","id":"0","method":"eth_blockNumber","params":[]}

    return new Promise(function (resolve, reject) {

        request.post(
            {
                headers: {
                    "content-type": "application/json",
                },
                url: 'http://127.0.0.1:16000',
                body: JSON.stringify(data),

            },
            function (error, response, body) {

                if (response.statusCode == 200) {

                    console.log("方法：", data.method);
                    console.log("参数：", JSON.stringify(data));
                    console.log("\n返回：", body);

                    resolve(JSON.parse(body));

                } else {
                    reject(error);
                }
            }
        );
    });

}

