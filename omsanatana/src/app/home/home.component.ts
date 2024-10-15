import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { CommonModule } from '@angular/common';
// import {
//   CarouselComponent,
//   CarouselInnerComponent,
//   CarouselItemComponent,
//   CarouselControlComponent,
//   CarouselCaptionComponent,
//   CarouselIndicatorsComponent,
//   ThemeDirective
// } from '@coreui/angular';




// declare var $: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  categories: any[] = [];
  latestArticles: any[] = [];
  articlesdata: any = {}; 
  religious: any[] = [];
  slides: any[] =[]
  intervalId: any;
  subCategories: any[] = [];
  training: any[] = [];



  constructor(private homepageservice:HomeService,private router:Router, private dialog:MatDialog,) {}

  ngOnInit(): void {
    this.fetchhome();
    this.fetchLatest();
    this.startAutoScroll();
    this.fetchtraining();
  }

  fetchhome(): void {
    this.homepageservice.homepage().subscribe(
      (data: any) => {
        this.categories = data.index;
        // this.religious = data.religion_categories;


      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }

  fetchtraining(): void {
    this.homepageservice.training().subscribe(
      (data: any) => {
        this.training = data.training_categories;
        // this.religious = data.religion_categories;


      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }


  fetchLatest(): void {
    this.homepageservice.latestpage().subscribe(
      (data: any) => {
        this.slides = data.main_category;   
            
      },
      error => {
        console.error('Error fetching latest articles', error);
      }
    );
  }

  


  startAutoScroll(): void {
    this.intervalId = setInterval(() => {
      this.moveToNextSlide();
    }, 3000); 
  }

  moveToNextSlide(): void {
    if (this.slides.length > 0) {
      const firstSlide = this.slides.shift(); 
      this.slides.push(firstSlide); 
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); 
    }
  }

  
navigateToCategory(categoryId: number): void {
  this.router.navigate(['religion', categoryId]); 
}
navigateToTraining(){
  this.router.navigate(['Training']);

}
navigateToindex(){
  this.router.navigate(['religion/:id']);

}
}




