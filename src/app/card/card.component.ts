import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit {
  @Input() animal: any;
  shedding: any;
  barking: any;
  energy: any;
  protectiveness: any;
  trainability: any;
  ngOnInit(): void {
  }

}
