module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost/"],
    },
    assert: {
      preset: "lighthouse:recommended",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
