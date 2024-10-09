import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { CommonModule } from '@angular/common';




declare var $: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories: any[] = [];
  latestArticles: any[] = [];
  articlesdata: any = {}; 
  religious: any[] = [];





  constructor(private homepageservice:HomeService,private router:Router, private dialog:MatDialog,) {}

  ngOnInit(): void {
    this.fetchhome();
    this.fetchLatest();
  }


  // fetchhome(): void {
  //   this.homepageservice.homepage().subscribe(
  //     (data: any) => {
  //       this.categories = data.results;

  //     },
  //     (error) => {
  //       console.error('Error fetching organizations:', error);
  //     }
  //   );
  // }

  fetchhome(): void {
    this.homepageservice.homepage().subscribe(
      (data: any) => {
        this.categories = data.main_categories;
        this.religious = data.religion_categories;


      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }

  fetchLatest(): void {
    this.homepageservice.latestpage().subscribe(
      (data: any) => {
        this.latestArticles = data.main_category;
        this.initializeCarousel(); // Initialize the carousel after data is loaded
      },
      error => {
        console.error('Error fetching latest articles', error);
      }
    );
  }

  initializeCarousel(): void {
    setTimeout(() => {
      // Initialize Bootstrap carousel after rendering the articles
      $('#latestArticlesCarousel').carousel({
        interval: 3000, // Change slides every 3 seconds
        pause: 'hover' // Pause on hover
      });
    }, 100); // Delay to allow Angular rendering
  }

  handleCardClick(): void {
    this.router.navigate(['/articles']);
  }


}
