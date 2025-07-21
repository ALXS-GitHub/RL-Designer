# TODO

## Main Tasks

- [ ] Refactor the app, having one part for designing and the other part for the installer application.
- [ ] This new installer application will allow the player to manage their installed stickers for each car (maybe also add balls stickers later on), add new stickers or remove them. The app will fetch those stickers from a server (maybe dropbox or google drive as I don't own a server). The app will be able to display the 3D model of the car and the stickers on it, allowing the player to see how it looks before installing it.
- [ ] Folder structure : 
  - as alpha console can find json files in subfolders it will be easier to have a folder for each decal and then the variants for each car in it. eg : Girls Aespa / Octane / Template.json, Girls Aespa / Fennec / Template.json, ...
  - The name of the decal is the one specified in the Template.json file, so it should be the same for all variants of the decal but with the car name in it.

## Important

- [ ] Fix bug : when going first to explorer page, the collection decals store are not initialized and it says all stickers from the explorer are not installed yet... (also have the same behavior on refreshing the page)
- [ ] Make the HowTo README files fetched from the public repo instead of them being fetched locally on build. (+ the images should also be fetched from the public repo so they are rendered properly in the HowTo page).
- [ ] Make the preview thumbnails (with the car and decal on it), when hovering a variant, it should change the preview thumbnail to the one of the variant. After this in the dedicated preview page, the user should be able to switch between the variants but also change the color of the car (primary and secondary color) to see how it looks with the decal.
- [ ] Create a script to automatically generate a template folder for a car based on a name and a variant.

- [ ] TODO : fix roadhog model -> still have the chassis part on it

- [ ] Make the how to page. First section is about how to use the app itself, second section is about how to make a decal and the third section is about how to manage the decals files and make the pull request to add them to the app. Each of those sections should be collapsable (collapsed by default) -> 3 components, one for each section.

- [ ] Maybe add a "Last update" field in the index.json (in fact with the scrip get the latest modification of any file from the public repo (just check locally)). We should also add this in some way when downloading so we can compare (maybe the last modification of the local files)

- [ ] Make a version management script that update the version app everywhere it needs to be updated (tauri.conf.json, package.json, etc.). This script should also update the version in the About page.

## Medium

## Low

## Done
- [X] Add the Loading and Error components on the pages.
- [X] Make the download / update functionality.

- [X] Use another github account to host the public repo of the decals. Add my current account as collaborator. We will be able to fetch the decals from there without api. Add this as a submodule in the main repo.
- [X] Add the navigation arrows on the navbar.
- [X] Watch back the video tutorial to make a decal (because I don't even remember myself how to do it) and update the Designer Guide with the new steps.
- [X] If possible make something that can automatically update the app