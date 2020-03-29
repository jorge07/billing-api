module.exports = {
    "preset": "ts-jest",
    "moduleDirectories": [
        "node_modules",
        "src"
    ],
    "transform": {
        ".(ts|tsx)": "ts-jest"
    },
    "testRegex": "(./tests/.*(test|spec)).(ts|js)$",
    "moduleFileExtensions": [
        "ts",
        "js",
        "json"
    ]
}
