const googleServices = require('../google_services');

describe('Google Services Catalog', () => {
  
  test('catalog should contain major Google Cloud services', () => {
    const services = googleServices.getServices();
    const ids = services.map(s => s.id);
    expect(ids).toContain('cloud-run');
    expect(ids).toContain('vertex-ai');
    expect(ids).toContain('gke');
  });

  test('each service should have a valid documentation link', () => {
    const services = googleServices.getServices();
    services.forEach(service => {
      expect(service.link).toMatch(/^https?:\/\//);
    });
  });

});
