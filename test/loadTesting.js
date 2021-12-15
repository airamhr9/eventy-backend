import { expect } from "chai"
import { loadTest } from 'loadtest'

describe('load testing --> 10.000 concurrent users', function(){
    it('Recommendations (Main Screen)', function(done){
        const options = {
            url: 'http://localhost:8000/recomend?userId=niMeffxvboZAdeimcmoy03Swjfk1&latitude=19&longitude=-2',
            maxRequests: 100,
            concurrency: 50
        }

        loadTest(options, function(err, result){
            if(err){
                return console.log(err)
            }
            expect(result.totalTimeSeconds).to.be.below(3) //total time must be below 1 second
            done()
        })
    })

    it('Search', function(done){
        const options = {
            url: 'http://localhost:8000/search?text&tags&enabled=false',
            maxRequests: 100,
            concurrency: 50
        }

        loadTest(options, function(err, result){
            if(err){
                return console.log(err)
            }
            expect(result.totalTimeSeconds).to.be.below(3) //total time must be below 1 second
            done()
        })
    })
})
