import {expect} from 'chai'
import {ClassorientedTeststate, ObjectArray, SimpleTeststate, SubTypeA} from './testobjects'
import {Replicator} from '../replicator'
import {deepFreeze, isDeepFrozen} from '../deepFreeze'

describe('Replicator', () => {

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new ClassorientedTeststate()
        let manipulatedRoot = Replicator.forObject(rootState).child('subTypeA').child('subTypeB').modify("subTypeBAttribute").to('Test').replicate()

        expect(rootState.subTypeA.subTypeB.subTypeBAttribute).to.null
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBAttribute).to.equal('Test')
    })

    it('Inputstate must not be modified, output must be modified', () => {
        let rootState = new ClassorientedTeststate()
        let manipulatedRoot = Replicator.forObject(rootState).child('subTypeA').child('subTypeB').modify("subTypeBAttribute").to('Test').replicate()

        expect(rootState.subTypeA.subTypeB.subTypeBAttribute).to.null
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBAttribute).to.equal('Test')
    })

    it('with untyped structure: Inputstate must not be modified, output must be modified', () => {
        let rootState = SimpleTeststate
        let manipulatedRoot = Replicator.forObject(rootState).child('subTypeB').modify("subtypeBAttribute").to('Test').replicate()

        expect(rootState.subTypeB.subtypeBAttribute).to.equal('initial')
        expect(manipulatedRoot.subTypeB.subtypeBAttribute).to.equal('Test')
    })

    it('if input state is deep frozen --> output state must be deep frozen', () => {
        let rootState = new ClassorientedTeststate()
        deepFreeze(rootState)
        let manipulatedRoot = Replicator.forObject(rootState).child('subTypeA').child('subTypeB').modify('subTypeBAttribute').to('Test').replicate()

        expect(rootState.subTypeA.subTypeB.subTypeBAttribute).to.null
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBAttribute).to.equal('Test')
        expect(isDeepFrozen(manipulatedRoot)).true
    })

    it('redux like root state --> if input state is deep frozen --> output state must be deep frozen', () => {
        let rootState = {
            subTypeA: new SubTypeA()
        }
        deepFreeze(rootState)
        let manipulatedRoot = Replicator.forObject(rootState).child('subTypeA').child('subTypeB').modify('subTypeBArray')
            .by((oldArray) => [...oldArray, 'Test']).replicate()

        expect(rootState.subTypeA.subTypeB.subTypeBArray.length).to.equal(0)
        expect(manipulatedRoot.subTypeA.subTypeB.subTypeBArray[0]).to.equal('Test')
        expect(isDeepFrozen(manipulatedRoot)).true
    })

    it('if input state is NOT frozen --> output state must NOT be frozen', () => {
        let rootState = new ClassorientedTeststate()
        let manipulatedRoot = Replicator.forObject(rootState).child('subTypeA').child('subTypeB').modify('subTypeBAttribute').to('Test').replicate()

        expect(Object.isFrozen(manipulatedRoot)).false
    })

    it('test performance of frozen big array', () => {
        let objectCount =  5000;
        let rootState = new ObjectArray(objectCount)
        deepFreeze(rootState)

        let repeatCount = 1
        let startTimestamp = new Date().getTime();
        for (let i = 0; i < repeatCount; i++) {
            Replicator.forObject(rootState).replicate()
        }
        let durationinMS = new Date().getTime() - startTimestamp
        console.info(repeatCount + ' clone repetitions with '+objectCount+' objects took ' + durationinMS + 'ms')


        expect(durationinMS).to.be.below(300)
    })

    it('test performance of not frozen big array', () => {
        let objectCount =  5000;
        let rootState = new ObjectArray(objectCount)

        let repeatCount = 1
        let startTimestamp = new Date().getTime();
        for (let i = 0; i < repeatCount; i++) {
            Replicator.forObject(rootState).replicate()
        }
        let durationinMS = new Date().getTime() - startTimestamp
        console.info(repeatCount + ' clone repetitions with '+objectCount+' objects took ' + durationinMS + 'ms')


        expect(durationinMS).to.be.below(100)
    })
})
