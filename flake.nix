{
  description = "App for recording one's thoughts";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      utils,
    }:
    utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages.thoughts = pkgs.buildNpmPackage {
          name = "thoughts";
          src = ./.;

          npmDepsHash = "sha256-CvIqq4MN2ReT5rWM8WmpJdX+Fd0jiLfW2256Cp6GnnA=";

          installPhase = ''
            cp -r ./dist $out
          '';
        };

        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
