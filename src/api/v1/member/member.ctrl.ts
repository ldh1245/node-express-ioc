import httpStatus from 'http-status';
import { JsonController, Get, HttpCode, QueryParams, Params, Post, Body, OnUndefined } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service, Inject } from 'typedi';
import { PaginationQuery } from '../common.dto';
import { CreateMemberRequestDto, MemberDetailRequestParam } from './member.dto';
import MemberService from './member.service';
import { Member } from 'entity/Member';

@JsonController('/v1/members')
@Service()
class MemberController {
    @Inject()
    private readonly memberService: MemberService;

    @Post('/')
    @HttpCode(httpStatus.CREATED)
    @OnUndefined(httpStatus.CREATED)
    @OpenAPI({
        summary: '멤버 생성',
        description: '멤버 생성',
        responses: {
            400: {
                description: 'Bad request',
            },
            500: {
                description: 'Internal server error (e.g, Duplicate key ..)',
            },
        },
    })
    async createMember(@Body({ required: true }) params: CreateMemberRequestDto): Promise<void> {
        await this.memberService.createMember(params);
    }

    @Get('/')
    @HttpCode(httpStatus.OK)
    @OpenAPI({
        summary: '멤버 목록 조회',
        description: '멤버 목록 조회',
        responses: {
            400: {
                description: 'Bad request',
            },
            500: {
                description: 'Internal server error',
            },
        },
    })
    async getMembers(
        @QueryParams() query: PaginationQuery,
    ): Promise<{ members: Member[]; totalCount: number; lastPage: number }> {
        const result = await this.memberService.getMembers(query);

        return result;
    }

    @Get('/:id/detail')
    @HttpCode(httpStatus.OK)
    @OnUndefined(httpStatus.NOT_FOUND)
    @OpenAPI({
        summary: '멤버 조회',
        description: '멤버 조회',
        responses: {
            400: {
                description: 'Bad request',
            },
            404: {
                description: 'Not found',
            },
            500: {
                description: 'Internal server error',
            },
        },
    })
    async getMember(@Params() params: MemberDetailRequestParam): Promise<Member> {
        const member = await this.memberService.getMember(params.id);

        return member;
    }
}

export default MemberController;
