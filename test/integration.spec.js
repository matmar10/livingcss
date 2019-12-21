/*jshint -W030 */

// test the index.js file and that everything works as expected
var expect = require('chai').expect;
var sinon = require('sinon');
var path = require('path');
var livingcss = require('../index');
var tags = require('../lib/tags');

describe('livingcss', function() {

  it('should resolve when all pages have been processed', function(done) {
    var file = path.join(__dirname, 'data/page-multiple-tags.css');
    var options = {
      preprocess: function(context) {
        return false;
      }
    };

    sinon.spy(options, 'preprocess');

    livingcss(file, '.', options).then(function() {
      expect(options.preprocess.called).to.be.true;
      expect(options.preprocess.callCount).to.equal(2);

      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('should resolve when no pages have been processed', function(done) {
    var file = path.join(__dirname, 'data/no-tags.css');
    var options = {
      preprocess: function(context) {
        return false;
      }
    };

    sinon.spy(options, 'preprocess');

    livingcss(file, '.', options).then(function() {
      expect(options.preprocess.called).to.be.false;

      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('should throw an error if a section is referenced but never defined', function(done) {
    var file = path.join(__dirname, 'data/sectionof-undefined-section.css');
    var options = {
      preprocess: function(context) {
        return false;
      }
    };

    livingcss(file, '.', options).then(function() {

      // this should not be hit
      done(new Error('Undefined section did not throw an error'));
    })
    .catch(function(e) {
      expect(e.message.indexOf('section \'Buttons\' is not defined')).to.not.equal(-1);

      done();
    });
  });

  it('should not carry over undefined section error from previous run', function() {
    expect(Object.keys(tags.forwardReferenceSections).length).to.equal(0);
  });

  it('should use custom tags', function(done) {
    var file = path.join(__dirname, 'data/simple-tag.css');
    var options = {
      preprocess: function(context) {
        return false;
      },
      tags: {
        tagName: function() {
          return false;
        }
      }
    };

    sinon.spy(options.tags, 'tagName');

    livingcss(file, '.', options).then(function() {
      expect(options.tags.tagName.called).to.be.true;
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

  it('should not modify original tags', function(done) {
    var file = path.join(__dirname, 'data/section.css');
    var options = {
      preprocess: function(context) {
        return false;
      },
      tags: {
        foo: function() {
          return false;
        }
      }
    };

    livingcss(file, '.', options).then(function() {
      expect(tags.foo).to.not.exist;
      done();
    })
    .catch(function(e) {
      done(e);
    });
  });

});