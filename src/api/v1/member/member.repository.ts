import { EntityRepository, MongoRepository } from 'typeorm';
import { Member } from 'entity/Member';
import { PaginationQuery } from '../common.dto';
import { CreateMemberRequestDto } from './member.dto';

@EntityRepository(Member)
class MemberRepository extends MongoRepository<Member> {
    async findMembersPaging(query: PaginationQuery): Promise<Member[]> {
        const { page, limit } = query;

        const members = await this.find({ order: { id: -1 }, skip: (page - 1) * limit, take: limit });

        return members;
    }

    async findMemberById(id: string): Promise<Member> {
        const member = await this.findOne(id);

        return member;
    }

    async createMember(params: CreateMemberRequestDto): Promise<void> {
        const member = this.create(params);

        await this.save(member);
    }
}

export default MemberRepository;
