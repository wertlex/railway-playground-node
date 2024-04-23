/**
 * Created by wert on 10.03.2021
 */
import chai = require('chai');
import chaiSubset = require('chai-subset');

chai.use(chaiSubset);

const { expect } = chai;

describe('Test', () => {
  it('should be okay', async () => {
    expect(true).to.be.true;
  });
});
