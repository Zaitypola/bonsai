import * as nock from 'nock';

export const nockHooks = () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  afterEach(() => {
    nock.cleanAll();
  });
};
