exports.index = (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return res.json({
    sistema: "API VetCare RESTful",
    versao: "1.0.0",
    status: "Operacional"
  });
};