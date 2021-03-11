module.exports = {
    "preset": "ts-jest",
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "transform": {
        ".(ts|tsx)": "ts-jest"
    },
    "testRegex": "./tests/.*(test|spec).(ts)$",
     "moduleNameMapper": {
         "@Tests/Transaction/(.+)$": [ "<rootDir>/tests/Billing/Transaction/$1" ],
         "@Tests/Shared/(.+)$": [ "<rootDir>/tests/Billing/Shared/$1" ],
         "@Tests/Apps/(.+)$": [ "<rootDir>/test/Apps/$1" ],
         "@Transaction/(.+)$": [ "<rootDir>/src/Billing/Transaction/$1" ],
         "@Shared/(.+)$": [ "<rootDir>/src/Billing/Shared/$1" ],
         "@Apps/(.+)$": [ "<rootDir>/src/Apps/$1" ]
     },
    "moduleFileExtensions": [
        "ts",
        "js",
        "json"
    ]
}
