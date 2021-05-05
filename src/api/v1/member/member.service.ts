import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import MemberRepository from './member.repository';
import { Member } from 'entity/Member';
import { PaginationQuery } from '../common.dto';
import { CreateMemberRequestDto } from './member.dto';
import * as lib from 'utils/lib';

@Service()
class MemberService {
    @InjectRepository()
    private readonly memberRepository: MemberRepository;

    async getMembers(query: PaginationQuery): Promise<{ members: Member[]; totalCount: number; lastPage: number }> {
        const [members, totalCount] = await Promise.all([
            this.memberRepository.findMembersPaging(query),
            this.memberRepository.count(),
        ]);

        return {
            members,
            totalCount,
            lastPage: lib.getLastPage(totalCount, query.limit),
        };
    }

    async getMember(id: string): Promise<Member> {
        return this.memberRepository.findMemberById(id);
    }

    async createMember(params: CreateMemberRequestDto): Promise<void> {
        await this.memberRepository.createMember(params);
    }
}

export default MemberService;
