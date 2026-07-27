const baseConfig = require("./app.json");

function githubPagesBaseUrl() {
  const repository = process.env.GITHUB_REPOSITORY || "";
  const [owner, repo] = repository.split("/");
  if (!repo || repo.toLowerCase() === `${owner}.github.io`.toLowerCase()) return "";
  return `/${repo}`;
}

module.exports = () => ({
  ...baseConfig.expo,
  web: {
    ...(baseConfig.expo.web || {}),
    bundler: "metro",
    output: "single",
    favicon: "./assets/favicon.png",
  },
  experiments: {
    ...(baseConfig.expo.experiments || {}),
    baseUrl: githubPagesBaseUrl(),
  },
});
