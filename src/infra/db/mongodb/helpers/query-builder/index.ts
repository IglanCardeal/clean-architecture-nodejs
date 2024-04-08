export type AnyObject = Record<string, any>

export class QueryBuilder {
  private readonly query: AnyObject[] = []

  match(data: AnyObject): QueryBuilder {
    this.query.push({
      $match: data
    })
    return this
  }

  group(data: AnyObject): QueryBuilder {
    this.query.push({
      $group: data
    })
    return this
  }

  sort(data: AnyObject): QueryBuilder {
    this.query.push({
      $sort: data
    })
    return this
  }

  unwind(data: AnyObject): QueryBuilder {
    this.query.push({
      $unwind: data
    })
    return this
  }

  lookup(data: AnyObject): QueryBuilder {
    this.query.push({
      $lookup: data
    })
    return this
  }

  project(data: AnyObject): QueryBuilder {
    this.query.push({
      $project: data
    })
    return this
  }

  build(): AnyObject[] {
    return this.query
  }
}
