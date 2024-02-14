import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetOrganizationDetails = createParamDecorator(
  (ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.organizationDetails;
  },
);
