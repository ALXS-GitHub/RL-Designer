# RL-Designer

## Dev Notes

### .env File Variables

```sh
VERSION=<version>
TAURI_SIGNING_PRIVATE_KEY=<private_key_content_or_path>
TAURI_SIGNING_PRIVATE_KEY_PASSWORD=<private_key_password>

```


### Constants

For easier deployment of new releases, we decided to set most of the variables inside "constants" files for the tauri and frontend parts of the app, check out those files to set the variables correctly. Here are the variables you need to set:

```
GITHUB_REPO_URL=<url_to_the_github_repo>
GITHUB_REPO_RAW_URL=<url_to_the_github_repo_raw>

ONLINE_BALL_DECAL_RELEASE_URL=<url_to_the_online_ball_decal_plugin_release>
```

Even if I still keep those in the `.env` file, they are not used anymore from here, so you can remove them if you want. I just keep them for reference.

### Release / Update process

1. Make sure the app is working properly and that all the features are implemented for the new version.
2. Update the version number in all the necessary files (e.g., `tauri.conf.json`, `package.json`, etc.). (I will later make a script to do this automatically)
3. Commit and push the changes to the `main` branch.
4. Merge the changes to the `release` branch and push it.
    This will trigger the GitHub Actions workflow to build the Tauri app and create a new release.




