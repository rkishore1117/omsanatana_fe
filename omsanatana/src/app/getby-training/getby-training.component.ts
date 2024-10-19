import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TrainingService } from '../services/training.service';

@Component({
  selector: 'app-getby-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getby-training.component.html',
  styleUrl: './getby-training.component.css'
})
export class GetbyTrainingComponent {



  organizationId: any;
  organization: any;

  constructor(private route: ActivatedRoute, private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id');
    this.gettraining();

    
  }

  gettraining(): void {
    this.trainingService.getTrainingById(this.organizationId).subscribe(
      (data: any) => {
        this.organization = data;
        console.log(this.organization, "Organization Details");
      },
      (error) => {
        console.error('Error fetching organization details:', error);
      }
    );
  }


  getVideoUrl(): string {
    if (this.organization && this.organization.video) {
      return `data:video/mp4;base64, ${this.organization.video}`;
    }
    return '';
  }

  

}

