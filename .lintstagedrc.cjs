module.exports = {
  "*": "prettier -w -u",
  "*.ts": "eslint . --report-unused-disable-directives --max-warnings 0",
  "*.nix": "nix fmt",
};
