import { expect } from "chai"
import { loadTest } from 'loadtest'

describe('stress testing', function(){
    it('acces should be capable of handeling 30 users', function(done){
        const options = {
            url: 'http://localhost:8000/tags',
            maxRequests: 100,
            concurrency: 30
        }

        loadTest(options, function(err, result){
            if(err){
                return console.log(err)
            }
            expect(result.totalTimeSeconds).to.be.below(1)
            done()
        })
    })
})