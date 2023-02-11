import { Component, OnInit } from '@angular/core';
import {select, Store} from '@ngrx/store';
import { switchMap } from 'rxjs';
import { Books } from '../store/books';
import { invokeUpdateBookAPI } from '../store/books.action';
import { selectBookById } from '../store/books.selector';
import {selectAppState} from "../../shared/store/app.selector";
import {setAPIStatus} from "../../shared/store/app.action";
import {ActivatedRoute, Router} from '@angular/router';
import {Appstate} from "../../shared/store/appstate";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appStore: Store<Appstate>
  ) {}

  bookForm: Books = {
    id: 0,
    author: '',
    name: '',
    cost: 0,
  };

  ngOnInit(): void {
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var id = Number(params.get('id'));
        return this.store.pipe(select(selectBookById(id)));
      })
    );
    fetchData$.subscribe((data) => {
      if (data) {
        this.bookForm = { ...data };
      }
      else{
        this.router.navigate(['/']);
      }
    });
  }

  udapte() {
    this.store.dispatch(
      invokeUpdateBookAPI({ updateBook: { ...this.bookForm } })
    );
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        this.router.navigate(['/']);
      }
    });
  }
}
