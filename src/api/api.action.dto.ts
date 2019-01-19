import { ApiModelProperty } from '@nestjs/swagger';

export class ApiActionDto {
    @ApiModelProperty({ example: { state: 'on' } })
    readonly action: any;

    @ApiModelProperty({ example: 'set' })
    readonly type: 'set' | 'get';
}
