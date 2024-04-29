# Thoughts

A small app for writing down one's thoughts thoughout the day.

## Design

The app is a PWA intended to store data only on the user's device for their own privacy. Users may import/export data as they please into standard formats.

## Development

To run the app locally, use the following command

```shell
npm install
npm run dev
```

To enable pre-commit formatting and linting, initalise husky

```shell
npx husky
```

## Deployment

As this is a static site, deployment can be achived with your HTTP server of choice. The project can be built with the following command

```shell
npm run build
```

The project will be exported to the `dist/` folder.

A Nix Flake is also provided for Nix user convenience. The build project is exported as `packages.${system}.thoughts`
