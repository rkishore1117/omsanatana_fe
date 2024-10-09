import { ChangeDetectorRef, Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReligiousService } from '../services/religious.service';
import { FormBuilder } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { FormGroup, FormsModule,Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-religion',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzSelectModule,NzFormModule,NzTreeModule],
  templateUrl: './religion.component.html',
  styleUrl: './religion.component.css'
})
export class ReligionComponent {
  categories: any[] = [];
  subcategories: any[] = [];
  // categoryId:any[] = [];
  selectedCategoryId:any;
  nodes: NzTreeNodeOptions[] = [];
  searchValue: string = '';
  categoryData: any;




  constructor(private religiousservice:ReligiousService,private router:Router, private dialog:MatDialog,private route:ActivatedRoute, private fb:FormBuilder,private cdr: ChangeDetectorRef ) {}



// ngOnInit(): void {
//   this.selectedCategoryId = this.route.snapshot.paramMap.get('id');

//   this.religiousservice.categeories().subscribe(
//     (response: any) => {
//       const categories = response.results;
//       this.nodes = this.createNodeTree(categories);

//       // this.nodes.push({ 
//       //   key: 'AllTemples', 
//       //   title: 'All', 
//       //   value: 'AllTemples', 
//       //   isLeaf: true, 
//       //   data: { type: 'all' } 
//       // });

//       this.nodes.sort((a, b) => a.title.localeCompare(b.title));
      
//     },
//     (err: any) => console.error('Error loading categories:', err) 
//   );
//   this.fetchDefaultCategoryData();
// }

// onCategoryClick(event: NzFormatEmitEvent): void {
//   const node: NzTreeNode = event.node!;
//   this.selectedCategoryId = node.key;

//   console.log(this.selectedCategoryId, "Category clicked");

//   // this.router.navigate(["organizations", this.selectedCategoryId]);

//   if (this.selectedCategoryId === 'AllTemples') {
//     this.selectedCategoryId = '';
//     return; 
//   }


//   this.religiousservice.getbydata(this.selectedCategoryId).subscribe(
//     (data: any) => {
//       this.categoryData = data; 
//       console.log('Fetched category data:', this.categoryData);
//     },
//     (err: any) => console.error('Error fetching category data:', err)
//   );

//   if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
//     const nodeType = node.origin['data']?.type;

//     if (nodeType === 'category') {
//       this.loadSubcategories(node, this.selectedCategoryId);
//     } else if (nodeType === 'subcategory') {
//       this.loadMinisubcategories(node, this.selectedCategoryId);
//     } else if (nodeType === 'minisubcategory') {
//       this.loadSpecificCategories(node, this.selectedCategoryId);
//     }
//   } else {
//     node.isExpanded = !node.isExpanded; 
//   }
// }





ngOnInit(): void {
  this.selectedCategoryId = this.route.snapshot.paramMap.get('id');

  this.religiousservice.categeories().subscribe(
    (response: any) => {
      const categories = response.results;
      this.nodes = this.createNodeTree(categories);


      this.nodes.sort((a, b) => a.title.localeCompare(b.title));
      
      if (this.selectedCategoryId) {
        this.fetchCategoryData(this.selectedCategoryId);
      }
    },
    (err: any) => console.error('Error loading categories:', err) 
  );
  this.fetchDefaultCategoryData();

}

onCategoryClick(event: NzFormatEmitEvent): void {
  const node: NzTreeNode = event.node!;
  this.selectedCategoryId = node.key;

  console.log(this.selectedCategoryId, "Category clicked");

  // this.router.navigate(["organizations", this.selectedCategoryId]);

  if (this.selectedCategoryId === 'AllTemples') {
    this.selectedCategoryId = null; 
    return; 
  }

  this.fetchCategoryData(this.selectedCategoryId);

  if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
    const nodeType = node.origin['data']?.type;

    if (nodeType === 'category') {
      this.loadSubcategories(node, this.selectedCategoryId);
    } else if (nodeType === 'subcategory') {
      this.loadMinisubcategories(node, this.selectedCategoryId);
    } else if (nodeType === 'minisubcategory') {
      this.loadSpecificCategories(node, this.selectedCategoryId);
    }
  } else {
    node.isExpanded = !node.isExpanded; 
  }
}

fetchCategoryData(categoryId: string): void {
  this.religiousservice.getbydata(categoryId).subscribe(
    (data: any) => {
      this.categoryData = data; 
      console.log('Fetched category data:', this.categoryData);
    },
    (err: any) => console.error('Error fetching category data:', err)
  );
}



loadSubcategories(node: NzTreeNode, categoryId: string | null): void {
  if (!categoryId) {
    console.error('Category ID is null or undefined.');
    return;
  }

  this.religiousservice.subcategeories(categoryId).subscribe(
    (response: any[]) => {  
      console.log('Subcategories response:', response);  

      const children = response.map(sub => ({
        title: sub.name,  
        key: sub._id,    
        isLeaf: false, 
        data: { type: 'subcategory' } 
      }));

      node.addChildren(children);
      node.isExpanded = true;
    },
    (err: any) => console.error('Error loading subcategories:', err) 
  );
}


loadMinisubcategories(node: NzTreeNode, subcategoryId: string | null): void {
  if (!subcategoryId) {
    console.error('Subcategory ID is null or undefined.');
    return;
  }

  this.religiousservice.minisubcategeories(subcategoryId).subscribe(
    (response: any[]) => {  
      console.log('Minisubcategories response:', response);  

      const minisubcategories = response.map(miniSub => ({
        title: miniSub.name,  
        key: miniSub._id,    
        isLeaf: false, 
        data: { type: 'minisubcategory' } 
      }));

      node.addChildren(minisubcategories);
      node.isExpanded = true;
    },
    (err: any) => console.error('Error loading minisubcategories:', err) 
  );
}


loadSpecificCategories(node: NzTreeNode, minisubcategoryId: string | null): void {
  if (!minisubcategoryId) {
    console.error('Minisubcategory ID is null or undefined.');
    return;
  }

  this.religiousservice.specificminisubcategeories(minisubcategoryId).subscribe(
    (response: any[]) => {  
      console.log('Specific categories response:', response);  

      const specificCategories = response.map(specCat => ({
        title: specCat.name,  
        key: specCat._id,    
        isLeaf: true, 
        data: { type: 'specificcategory' } 
      }));

      node.addChildren(specificCategories);
      node.isExpanded = true;
    },
    (err: any) => console.error('Error loading specific categories:', err) 
  );
}

createNodeTree(data: any[]): NzTreeNodeOptions[] {
  return data.map(item => ({
    title: item.name,
    key: item._id,
    isLeaf: false,
    data: { type: 'category' } 
  }));
}



  fetchDefaultCategoryData(): void {
    const defaultCategoryId = '79af0d7e-9cb1-4c74-942b-06ce1dad9883'; 
    this.religiousservice.getbydata(defaultCategoryId).subscribe(
      (data: any) => {
        this.categoryData = data;
        console.log('Fetched default category data:', this.categoryData);
      },
      (err: any) => console.error('Error fetching default category data:', err)
    );
  }





  


  highlightText(text: string): string {
    if (!text || !this.categoryData) {
      return text;
    }

    const categoryNames = [this.categoryData.name, ...(this.categoryData.subcategories || []).map((sub: { name: any; }) => sub.name)];
    
    const escapedNames = categoryNames.map(name => name.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'));
    
    const pattern = escapedNames.join('|'); 
    const regex = new RegExp(`(${pattern})`, 'gi'); 

    return text.replace(regex, (match) => {
      return `<a href="javascript:void(0);" class="highlight" (click)="navigateToCategory('${match}')">${match}</a>`;
    });
  }

  navigateToCategory(categoryName: string): void {
    const category = this.categoryData.subcategories.find((sub: { name: string; }) => sub.name === categoryName) || this.categoryData;
    this.selectedCategoryId = category._id; 
  }















}