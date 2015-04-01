// https://github.com/jedrichards/grunt-rsync
module.exports = {
  dist: {
    options: {
      args: ["--verbose"],
      src: "./dist/docs/",
      recursive: true,
      dest: "/home/deployer/sites/foundation-docs/current",
      host: "deployer@72.32.134.77"
    }
  }
};