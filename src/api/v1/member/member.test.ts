import clc from 'cli-color';
import { Server } from 'http';
import request from 'supertest';
import { expect } from 'chai';
import { ObjectID } from 'mongodb';
import { bootstrap, destroy } from 'bootstrap';

describe(clc.bgGreen(clc.black('MEMBER')), () => {
    let server: Server;
    let id: string;

    before(async () => {
        server = await bootstrap();
    });

    after(async () => {
        await destroy();

        server.close();
    });

    describe('POST /v1/members', () => {
        it('파라미터가 누락된 경우엔 실패해야함.', (done) => {
            request(server).post('/v1/members').send({ firstName: 'first' }).expect(400, done);
        });

        it('파라미터 중에 빈 값이 있는 경우엔 실패해야함.', (done) => {
            request(server).post('/v1/members').send({ firstName: 'first', age: 2, lastName: '' }).expect(400, done);
        });

        it('파라미터의 타입이 잘못된 경우엔 실패해야함.', (done) => {
            request(server)
                .post('/v1/members')
                .send({ firstName: 'first', lastName: 'last', age: 'asd' })
                .expect(400, done);
        });

        it('정상적인 경우엔 성공해야함.', (done) => {
            request(server)
                .post('/v1/members')
                .send({ firstName: 'first', lastName: 'last', age: 4 })
                .expect(201, done);
        });
    });

    describe('GET /v1/members', () => {
        it('페이지 파라미터가 누락된 경우 실패해야함.', (done) => {
            request(server).get('/v1/members').expect(400, done);
        });

        it('페이지 파라미터가 범위를 초과하는 경우 실패해야함.', (done) => {
            request(server).get('/v1/members').query({ page: 1, limit: 10000 }).expect(400, done);
        });

        it('페이지 파라미터의 형식이 잘못된 경우 실패해야함.', (done) => {
            request(server).get('/v1/members').query({ page: 'A', limit: '테스트' }).expect(400, done);
        });

        it('목록과 페이지 정보를 반환해야함.', (done) => {
            request(server)
                .get('/v1/members')
                .query({ page: 1, limit: 10 })
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;

                    expect(res.body).has.property('members');
                    expect(res.body.members).instanceOf(Array);
                    expect(res.body).has.property('totalCount');
                    expect(res.body).has.property('lastPage');

                    id = res.body.members[0].id;

                    done();
                });
        });
    });

    describe('GET /v1/members/:id/detail', () => {
        it('파라미터가 잘못된 경우엔 실패해야함.', (done) => {
            request(server).get(`/v1/members/asd/detail`).expect(400, done);
        });

        it('존재하지 않는 유저인 경우엔 404를 반환해야함.', (done) => {
            request(server).get(`/v1/members/${new ObjectID()}/detail`).expect(404, done);
        });

        it('정상적인 경우엔 객체를 반환해야함.', (done) => {
            request(server)
                .get(`/v1/members/${id}/detail`)
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;

                    expect(res.body).instanceOf(Object);

                    done();
                });
        });
    });
});
