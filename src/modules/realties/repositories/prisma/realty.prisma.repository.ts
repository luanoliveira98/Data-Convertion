import { Injectable } from "@nestjs/common";
import { PrismaService } from "@src/modules/shared/domain/services/prisma.service";
import { RealtyEntity } from "../../domain/entities/realty.entity";
import { RealtyRepository } from "../../domain/interfaces/realty.repository.interface";

@Injectable()
export class RealtyPrismaRepository implements RealtyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create({ id, title }: RealtyEntity): Promise<RealtyEntity> {
    return this.prismaService.realty.create({
      data: { id, title },
    });
  }
}
