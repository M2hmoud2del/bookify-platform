import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SearchComponent } from '../../../shared/components/search/search.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-provider-customers',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent, SearchComponent, PaginationComponent],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent {
  customers = [
    { id: '1', name: 'Emma Wilson', email: 'emma.wilson@email.com', appointments: 8, spent: 520 },
    { id: '2', name: 'James Brown', email: 'james.brown@email.com', appointments: 5, spent: 380 },
    { id: '3', name: 'Sarah Davis', email: 'sarah.davis@email.com', appointments: 3, spent: 150 },
  ];
}
