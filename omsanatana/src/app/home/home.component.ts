import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeService } from '../services/home.service';
import { CommonModule } from '@angular/common';

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





  constructor(private homepageservice:HomeService,private router:Router, private dialog:MatDialog,) {}

  ngOnInit(): void {
    this.fetchhome();
    this.fetchLatest();
  }


  fetchhome(): void {
    this.homepageservice.homepage().subscribe(
      (data: any) => {
        this.categories = data.results;

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

      },
      error => {
        console.error('Error fetching latest articles', error);
      }
    );
  }

  getArticleCategories(): string[] {
    return Object.keys(this.articlesdata);
  }

  getArticleCount(category: string): number {
    return this.articlesdata[category]?.length || 0;
  }

  handleCardClick() {
    this.router.navigate(['/articles']);
  }

}
