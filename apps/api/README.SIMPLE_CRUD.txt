
// [service-name] eg. QuotaTypeService

// [entity-name] eg. QuotaType

// [repository-instance] eg. quotaRepository

// [create-dto-instance] eg. createQuotaTypeDto

// [create-d-t-o] eg. CreateQuotaTypeDto

// [update-dto-instance] eg. updateQuotaTypeDto

// [update-d-t-o] eg. UpdateQuotaTypeDto

// [data-assigned-variable] 
// eg. assigning. const quotaInstance (this one)  = Object.assign(new QuotaType(), createQuotaTypeDto);

// <created-object-variable>
// eg create. const quota (this one) = this.quotaRepository.create(quotaInstance);

// <saved-data-variable> 
// eg. saved.  const [newQuota (this one), error] = await safeError()

// <updated-data-variable> 
// eg updated.  const [updatedQuota (this one), error] = await safeError()

// <deleted-data-variable>
// eg deleted.  const [deletedQuota (this one), error] = await safeError()

// <all-data-variable> 
//eg findall. const [quotas (this one), error] = await safeError(find

// <message-variable-single>

// <message-variable-plural>




Copy from here : add inside the class 


// [entity-name]  QuotaType

// [repository-instance]  quotaRepository

// [create-dto-instance]  createQuotaTypeDto

// [create-d-t-o]  CreateQuotaTypeDto

// [update-dto-instance]  updateQuotaTypeDto

// [update-d-t-o]  UpdateQuotaTypeDto

// [data-assigned-variable] quotaInstance

// <created-object-variable> quota

// <saved-data-variable> newQuota

// <updated-data-variable> updatedQuota

// <deleted-data-variable> deletedQuota

// <all-data-variable> quotas

// <message-variable-single> 

// <message-variable-plural>


  constructor(
    @InjectRepository([entity-name])
    private readonly [repository-instance]  : Repository<[entity-name]>,
  ) {}
  async create([create-dto-instance]:[create-d-t-o]) {
    const [data-assigned-variable] = Object.assign(new [entity-name](), [create-dto-instance]);
    const <created-object-variable> = this.[repository-instance].create([data-assigned-variable]);
    const [<saved-data-variable>, error] = await safeError(
      runInTransaction(async (queryRunner) => {
        return await queryRunner.manager.save([entity-name], <created-object-variable>);
      }),
    );
    if (error) throw new InternalServerErrorException(`Error saving <message-variable-single>.`);
    return {
      success: true,
      message: `<message-variable-single> has been saved successfully.`,
    };
  }
  
  async findAll(query: any){
    const { sortBy, orderBy } = getSortingOptions(query);
    const { skip, take } = getPaginationOptions(query);

    const qb = this.[repository-instance]
    .createQueryBuilder('<created-object-variable>')
    .leftJoin('<created-object-variable>'.<<join-table-name>>', '<<representational-join-table-name>>')
    .select([
      '<created-object-variable>.id',
      //you are welcome to add more
    ]);

    applySearch(qb, query.search, [
      '<created-object-variable>'.<<search-column-name-1>>', //in which columns to search
      '<created-object-variable>'.<<search-column-name-2>>',
  ]);

    qb.addSelect(`<created-object-variable>.${sortBy}`)
      .orderBy(`<created-object-variable>.${sortBy}`, orderBy)
      .skip(skip)
      .take(take);

    const [<all-data-variable>AndCount, error] = await safeError(qb.getManyAndCount());

    if (error) {
        throw new InternalServerErrorException(
          'Error while fetching <message-variable-plural>. Please try again later.',
        );
      }

    const [<all-data-variable>, totalCount] = <all-data-variable>AndCount;

    return {
      success: true,
      message: `<message-variable-plural> fetched successfully.`,
      data: <all-data-variable>,
      meta: getPaginationMeta(totalCount, page, limit, <all-data-variable>.length),
    };
  }

  async findOne(id: number){
    const [<created-object-variable>, error] = await safeError(
      this.[repository-instance]
        .createQueryBuilder('<created-object-variable>')
        .leftJoin('<created-object-variable>.<<join-table-name>>', '<<representational-join-table-name>>')
        .leftJoinAndSelect('<created-object-variable>.<<join-table-name>>', '<<representational-join-table-name>>')
        .select([
          '<created-object-variable>.id',
          //add more as you wish
        ])
        .where({ id })
        .getOne()
    );

    if (error) {
      throw new InternalServerErrorException(`Error while fetching <message-variable-single>.`);
    }

    if(!<created-object-variable>){
      throw new NotFoundException(`<message-variable-single> with id : ${id} not found.`)
    }

    return {
      success: true,
      message: `<message-variable-single> fetched successfully.`,
      data: <created-object-variable>
    };
  }

  async update(id: number, [update-dto-instance]: [update-d-t-o]) {
    const <created-object-variable> = await this.findOne(id);
    Object.assign(<created-object-variable>, [update-dto-instance]);
    const [<updated-data-variable> , error] = await safeError(
      runInTransaction(async (queryRunner) => {
        return await queryRunner.manager.save([entity-name], <created-object-variable>);
      }),
    );
    if (error) throw new InternalServerErrorException(`Error updating <message-variable-single>`);
    return {
      success: true,
      message: `<message-variable-single> updated successfully.`,
    };
  }

  async remove(id: number) {
    const <created-object-variable> = await this.findOne(id);
    const [<deleted-data-variable>, error] = await safeError(
      runInTransaction(async (queryRunner) => {
        return await queryRunner.manager.softRemove([entity-name], <created-object-variable>);
      }),
    );
    if (error) throw new InternalServerErrorException(`Error deleting <message-variable-single>.`);
    return {
      success: true,
      message: `<message-variable-single> deleted successfully.`,
    };
  }




