import { Body, Controller, Post, Get} from '@nestjs/common';
import { TutorialService } from '../service/tutorial.service';


@Controller('tutorial')
export class TutorialController {
    constructor(private readonly tutorialService: TutorialService){}

    @Post('createData')
    async createData(@Body() data: any): Promise <void>{
        await this.tutorialService.createData(data);
    }
    
    @Get('getData')
    async getData(): Promise<any>{
        return this.tutorialService.getData();
    }
}