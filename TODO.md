# TODO

## Main Tasks

- [ ] Refactor the app, having one part for designing and the other part for the installer application.
- [ ] This new installer application will allow the player to manage their installed stickers for each car (maybe also add balls stickers later on), add new stickers or remove them. The app will fetch those stickers from a server (maybe dropbox or google drive as I don't own a server). The app will be able to display the 3D model of the car and the stickers on it, allowing the player to see how it looks before installing it.
- [ ] Folder structure : 
  - as alpha console can find json files in subfolders it will be easier to have a folder for each decal and then the variants for each car in it. eg : Girls Aespa / Octane / Template.json, Girls Aespa / Fennec / Template.json, ...
  - The name of the decal is the one specified in the Template.json file, so it should be the same for all variants of the decal but with the car name in it.

## Important

- [ ] If possible make something that can automatically update the app

- [ ] Make a script to make sure the decals in `decals/decals` are the same as the ones in the submodule. The one in `decals/decals` should be considered the "master" version, the one in the submodule is just a copy of it that is being used as a public repo to host the decals.

## Medium

## Low

## Done
- [X] Add the Loading and Error components on the pages.
- [X] Make the download / update functionality.

- [X] Use another github account to host the public repo of the decals. Add my current account as collaborator. We will be able to fetch the decals from there without api. Add this as a submodule in the main repo.