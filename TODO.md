# TODO

## Main Tasks


## Important

- [~]  Maybe add a "Last update" field in the index.json. To do this, we may implement a hash function that takes all the file from a variant's folder and generates a hash based on their content. This would be a simple way to check if the version matches. So each time we update the index, we would also compute the hash of all the files in the variant and put it in the index. This way we can compute the hash locally and compare it with the hash online. -> Then on the app, we can display in another color (purple for example) with a "sync" icon to indicate that the variant is not up to date. 
  - Still need to add some update logic in the collection page (for now it is only done on the explorer page). This should work the same as in the explorer page.

- [ ] Update docs
- [ ] Add the secondary color.

## Medium

- [ ] Fix public files for production app (the model/obj is converted to text/html). For now the check is very specific. We should find a way to check if the file exists in the public folder more generally...
- [ ] Try premium skin decals
- [ ] Try universal decal support
- [ ] Add wheel texture support
  - For both ball and wheel, we should make add those collections / explorer inside the already existing pages, just make a select to choose between the car, ball or wheel textures. We should also manage how they are stored locally and how they are stored in the public repo. + Do they need variants ? I suppose yes, a ball even if the same object can have different textures for a same logo.
- [ ] I just set back the "source" prop in the useQuery and useExplorer hook, but it is not the best solution. We should find a better way to handle the source prop and the query key. --> I think creating a context should work (so it is a single instance of the hook and the query) so the loading state is shared between the two components. (We just need to make sure the Loading state is well managed to avoid infinite loading...)

## Low

- [ ] fix internal links not working in the HowTo page.
- [ ] Decal setup verification script (to make sure no issue will happen / and that no recommended fields (such as Group) are missing)

## Is this needed ?

- [?] Integrate the profile picture plugin into the app ~ going to be harder that just putting a file in the folders, as the plugin apparently sends the file to CDN, so the in game use is preferred.

  
## Done
- [X] Add the Loading and Error components on the pages.
- [X] Make the download / update functionality.

- [X] Use another github account to host the public repo of the decals. Add my current account as collaborator. We will be able to fetch the decals from there without api. Add this as a submodule in the main repo.
- [X] Add the navigation arrows on the navbar.
- [X] Watch back the video tutorial to make a decal (because I don't even remember myself how to do it) and update the Designer Guide with the new steps.
- [X] If possible make something that can automatically update the app
- [X] TODO : fix roadhog model -> still have the chassis part on it (split by different materials I think this would work)
- [X] Make the how to page. First section is about how to use the app itself, second section is about how to make a decal and the third section is about how to manage the decals files and make the pull request to add them to the app. Each of those sections should be collapsable (collapsed by default) -> 3 components, one for each section.
- [X] Refactor the app, having one part for designing and the other part for the installer application.
- [X] This new installer application will allow the player to manage their installed stickers for each car (maybe also add balls stickers later on), add new stickers or remove them. The app will fetch those stickers from a server (maybe dropbox or google drive as I don't own a server). The app will be able to display the 3D model of the car and the stickers on it, allowing the player to see how it looks before installing it.
- [X] Folder structure : 
  - as alpha console can find json files in subfolders it will be easier to have a folder for each decal and then the variants for each car in it. eg : Girls Aespa / Octane / Template.json, Girls Aespa / Fennec / Template.json, ...
  - The name of the decal is the one specified in the Template.json file, so it should be the same for all variants of the decal but with the car name in it.
- [X] Fix bug : when going first to explorer page, the collection decals store are not initialized and it says all stickers from the explorer are not installed yet... (also have the same behavior on refreshing the page)
- [X] Check for the "Group" Field in the Template.json (example in the ballTexture folder, ... maybe we could use this to create a group of decals inside the game. This could be useful to set all our variants here)
- [X] Fix external links opening inside the app instead of opening in an external browser.
- [X] Make the HowTo README files fetched from the public repo instead of them being fetched locally on build. (+ the images should also be fetched from the public repo so they are rendered properly in the HowTo page).
- [X] Make a version management script that update the version app everywhere it needs to be updated (tauri.conf.json, package.json, etc.).
- [X] Move the .env vars to constants in the app, it will be easier for deployment
- [X] Check https://github.com/smallest-cock/Custom-Ball-Online, this is a patch for allowing custom ball textures in online games. If possible make an automatic installation/updater script for it.
- [X] Fix infinite loading when refreshing on the Collection page.
- [X] Update All Installed Button - At the same place as the type select, add the update all button.
- [X] Add ball texture support
- [X] Automate the release process for new versions of the tauri app. Using GitHub Actions (maybe triggered on release branch push) -> Still need to check if it works...
- [X] Install All Variants button
- [X] when hovering a variant, it should change the preview thumbnail to the one of the variant
- [X] Refactor Navbar (to have a cleaner way to handle the two display modes of the navbar)
- [X] Fix bug : when switching from Collection page (and hovered a car to display the model), and then going to the Explore page, it displays the last model viewed in the Collection page instead of the one from the Explore page.
  -> Goes from MeshPhongMeterial to ShaderMaterial (the one we define when it has a skin)
- [X] Make the preview thumbnails (with the car and decal on it) (Maybe for the thumbnail, only show the model when we are hovering the variant name on the card. This to avoid to have too many models to render...). In the dedicated preview page, the user should be able to switch between the variants but also change the color of the car (primary and secondary color) to see how it looks with the decal.
  - [X] Create the assets mapping, instead of having to look for the public folder (suggested by copilot) -> great because we can have the list of available models.
  - [X] Make the canva size larger (and dynamic / responsive) to better fit the page
  - [X] make a button to stop rotation
  - [X] Make the colors changeable
- [X] Refactor the CarModel (and rename Model3D) thing (it's a bit messy right not)
- [X] Refactor 3D model so each function takes types (maps/records -> interface for each function) instead of taking the parameters directly. This will allow us to have a more flexible and reusable code.
- [X] reuse the code for the single material inside the array materials function 
- [X] To integrate the chassis texture, we have to extend / patch the shader material ?? (I don't know for now, but this is something to investigate : how to integrate the chassis texture in the car model)
- [X] refactor properly the add of the chassis texture in the functions of the Model3D component (to avoid code duplication), and cleaner approach to handle the materials.
- [X] I have tested if we load the entire car model (body + chassis) and indeed it works fine and apply the decal to the body part. So we can have the full car model in the app (with chassis and the chassis texture (if it exists in the Template.json, else use a template (if I can find one for each car))) + Add some wheels to the models (Cristiano wheels)
- [X] Custom setting to switch between multiple predefined materials (some more metallic, other more plastic, etc...)
- [X] Create new sets of default materials
- [X] Handle the colors more properly (in the store and the color picker)
- [X] Add the Curvature map (in public) in order to make the car color changeable.
- [X] Todo : better function to capitalize word with spaces in it (main color for example)
- [X] Remove the Cancel and Ok buttons from the pickers. Should set the material on click and for the color should be set when going out of the input color picker.
- [X] Make a check for images from the public folder (a function that checks if the image exists in the public folder, if not, it should return null or a default image)
- [X] Fix  : Fix python and rust xxh3 not giving the same hash