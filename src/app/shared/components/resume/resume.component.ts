import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Reserva } from '../../models/reservas';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  resume: Reserva;

  constructor(public dialogRef: MatDialogRef<ResumeComponent>, 
                                @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.resume = this.data;
  }
}