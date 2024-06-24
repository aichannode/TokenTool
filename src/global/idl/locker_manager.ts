export type LockerManager = {
    "version": "0.1.0",
    "name": "locker_manager",
    "instructions": [
        {
            "name": "initializeLockAccount",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "lockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "lockTokens",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "lockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "from",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "to",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "releaseTime",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "releaseTokens",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "lockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "from",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "to",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "LockAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "amount",
                        "docs": [
                            "The amount of tokens locked"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "releaseTime",
                        "docs": [
                            "The release time of the locked tokens"
                        ],
                        "type": "i64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "ReleaseTimeInPast",
            "msg": "Release time must be in the future"
        },
        {
            "code": 6001,
            "name": "TokensLocked",
            "msg": "Tokens are still locked"
        },
        {
            "code": 6002,
            "name": "AccountAlreadyInUse",
            "msg": "Account is already in use"
        },
        {
            "code": 6003,
            "name": "AccountEmpty",
            "msg": "Account is empty"
        },
        {
            "code": 6004,
            "name": "InvalidAccountData",
            "msg": "Invalid account data"
        }
    ],
    "metadata": {
        "address": "4ycA4x1FJdbFsa6XQZrDaCBBefaDDzZnQMubavi3jpEx"
    }
}


export const LiquidityIDL: LockerManager = {
    "version": "0.1.0",
    "name": "locker_manager",
    "instructions": [
        {
            "name": "initializeLockAccount",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "lockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "lockTokens",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "lockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "from",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "to",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "releaseTime",
                    "type": "i64"
                }
            ]
        },
        {
            "name": "releaseTokens",
            "accounts": [
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "lockAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "from",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "to",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "LockAccount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "amount",
                        "docs": [
                            "The amount of tokens locked"
                        ],
                        "type": "u64"
                    },
                    {
                        "name": "releaseTime",
                        "docs": [
                            "The release time of the locked tokens"
                        ],
                        "type": "i64"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "ReleaseTimeInPast",
            "msg": "Release time must be in the future"
        },
        {
            "code": 6001,
            "name": "TokensLocked",
            "msg": "Tokens are still locked"
        },
        {
            "code": 6002,
            "name": "AccountAlreadyInUse",
            "msg": "Account is already in use"
        },
        {
            "code": 6003,
            "name": "AccountEmpty",
            "msg": "Account is empty"
        },
        {
            "code": 6004,
            "name": "InvalidAccountData",
            "msg": "Invalid account data"
        }
    ],
    "metadata": {
        "address": "4ycA4x1FJdbFsa6XQZrDaCBBefaDDzZnQMubavi3jpEx"
    }
}