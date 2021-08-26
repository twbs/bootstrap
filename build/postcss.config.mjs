const mapConfig = {
  inline: false,
  annotation: true,
  sourcesContent: true
}

// eslint-disable-next-line import/no-anonymous-default-export
export default context => {
  return {
    map: context.file.dirname.includes('examples') ? false : mapConfig,
    plugins: {
      autoprefixer: {
        cascade: false
      },
      rtlcss: context.env === 'RTL'
    }
  }
}
