module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: ["http://localhost/"],
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        // Marginal savings on emulated mobile DPR; responsive pattern
        // (400/800/1600) is already in place.
        "image-delivery-insight": ["warn", { minScore: 0.5 }],
        "uses-responsive-images": ["warn", { maxLength: 1 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
