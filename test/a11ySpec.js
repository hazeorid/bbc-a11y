var a11y = require('../lib/a11y.js')
var expect = require('chai').expect
var $ = require('jquery')

describe('a11y', function() {
  beforeEach(function() {
    $('body').html('')
  })

  it('validates the DOM', function() {
    var validation = a11y.validate()
    var errors = validation.results.filter(function(standardResult) {
      return standardResult.errors.length > 0
    }).map(function(standardResult) {
      standardResult.errors = standardResult.errors.map(function(error) {
        return error.map(function(segment) {
          return segment.xpath ? segment.xpath : segment
        })
      })
      return standardResult
    })
    var expectedErrors = [
      {
        "standard": {
          "section": "headings",
          "name": "Exactly one main heading"
        },
        "errors":[
          ["Found 0 h1 elements."]
        ],
        "hiddenErrors": []
      },
      {
        "standard": {
          "section": "indicatingLanguage",
          "name": "Html must have lang attribute"
        },
        "errors":[
          ["html tag has no lang attribute:","/html"]
        ],
        "hiddenErrors": []
      },
      {
        "standard": {
          "section": "mainLandmark",
          "name": "Exactly one main landmark"
        },
        "errors":[
          ['Found 0 elements with role="main".']
        ],
        "hiddenErrors": []
      }
    ]
    expect(JSON.stringify(errors)).to.equal(JSON.stringify(expectedErrors))
  })

  it('skips standards', function() {
    var validation = a11y.validate({ skip: ['Main landmark: Exactly one main landmark'] })
    expect(validation.skipped).to.eql(['Exactly one main landmark'])
  })

  it('hides errors', function() {
    var validation = a11y.validate({ hide: ['Found 0 elements with role="main".'] })
    var resultsWithErrors = validation.results.filter(function(standardResult) {
      return standardResult.hiddenErrors.length > 0
    })
    expect(resultsWithErrors[0].errors).to.eql([])
    expect(resultsWithErrors[0].hiddenErrors).to.eql([['Found 0 elements with role="main".']])
  })

  it('only runs specific standards', function() {
    var validation = a11y.validate({ only: ['Main landmark: Exactly one main landmark'] })
    expect(validation.results.length).to.equal(1)
    expect(validation.results[0].standard.name).to.equal('Exactly one main landmark')
  })
})
