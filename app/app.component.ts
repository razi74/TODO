import { Component, OnInit, Injectable, Directive, Renderer, ElementRef, EventEmitter, Output} from '@angular/core';
import { Control, CORE_DIRECTIVES, FORM_DIRECTIVES} from '@angular/common';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import { HTTP_PROVIDERS, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Directive({
    selector: 'input[type=text]'
})
class MyInput {
    constructor(public renderer: Renderer, public elementRef: ElementRef) { }

    ngOnInit() {
        this.renderer.invokeElementMethod(
            this.elementRef.nativeElement, 'focus', []);
    }

    //ngAfterViewInit
}
//============================================================================
@Injectable()
export class TodoService {
    todolist;
    constructor(private _http: Http) { }
    getTodoList() {
        var aPromise = this._http.get("/items.json")
            .map((response: Response) => response.json().data)
            .toPromise()
        aPromise.then(tasksFromServer => this.todolist = tasksFromServer);
    }
    addItem(item) {
        this.todolist.push(item);
    }
}
//=========================================================
@Component({
    selector: 'todocomp-new',
    directives: [ROUTER_DIRECTIVES, MyInput, CORE_DIRECTIVES, FORM_DIRECTIVES],
    providers: [ROUTER_PROVIDERS],
    templateUrl: 'app/todo.html'

    //pattern ="^[^ ]\\w*|\\w*[^ ]"

})
export class TodoNewComponent implements OnInit {
    item;
    oldItemTitleValue;
    @Output() eventEmitterDoubleClick = new EventEmitter();

    onRemove(item, headcbb) {
        this.todoSrvc.todolist.splice(this.todoSrvc.todolist.indexOf(item), 1);
        item.isEditing = false;
        if (this.todoSrvc.todolist.length == 0) {
            headcbb.checked = false;
        }
    }

    onEditSubmit(item, event) {
        console.log( " - " + event.keyCode );
        if ((event.type == "click") || event.keyCode == 13 ||event.type == "blur") {    
            var temp3 = String(item.title);
            if (temp3.length == 0) {
                this.todoSrvc.todolist.splice(this.todoSrvc.todolist.indexOf(item), 1);
            }
            item.title = temp3.trim();
            item.isEditing = false;
        }
        else   if ( event.keyCode ==27) {
            item.isEditing = false;
            item.title = this.oldItemTitleValue;
        }
    }
    eventEmitDoubleClick(item, event) {
        //console.log("in the comp");
        this.eventEmitterDoubleClick.emit(event);
        this.oldItemTitleValue = item.title;
        if (!item.completed) {
            item.isEditing = true;
        }
    }
    constructor(public todoSrvc: TodoService) {
        this.item = { title: "", completed: false };
    }
    ngOnInit() {
        this.todoSrvc.getTodoList();
    }
    onCreateSubmit(item, event, headcbb) {
        var temp3 = String(item.title);
        var temp4 = temp3.trim();
        console.log(item + " - " + event.type + " - " + event.keyCode + " - " + event.target + " - " + event.currentTarget.id + " - " + event.target + " - " + temp4.length);
        if ((event.type == "click") || event.keyCode == 13) {

            console.log(temp4 == null || temp4.length == 0);
            if (temp4 == null || temp4.length == 0) {
                alert("Please enter item description.. ");
            }
            else {
                item.title = temp4;
                item.id = String(Math.floor((Math.random() * 1000) + 1));
                this.todoSrvc.addItem(item);
                this.item = { title: "", completed: false };

                if (this.todoSrvc.todolist.length == 0) {
                    headcbb.checked = false;
                }
            }
        }
    }

    toggleMain(event, item) {
        var isChecked = event.currentTarget.checked;
        var i;
        var lst = this.todoSrvc.todolist;
        for (i = 0; i < lst.length; i++) {
            var k = lst[i];
            k.completed = isChecked;
            k.selected = isChecked;
        }
    }
    toggleIndividual(event, item, headcbb) {
      console.log(item + " - " + event.type + " - " + event.keyCode + " - " + event.target + " - " + event.currentTarget.id + " - " + event.target + " - " +event.currentTarget.checked );
        var chkboxvalue = event.currentTarget.checked;
        if(event.type=="mouseover")
        {
          chkboxvalue=true;   item.completed  = true; item.selected = true;
        }
        if (chkboxvalue) {
            item.isEditing = false;
            item.completed = chkboxvalue;
            var lst = this.todoSrvc.todolist;
            var i;
            var toggle = false;
            for (i = 0; i < lst.length; i++) {
                var temp = lst[i].id != event.currentTarget.id;
                if (temp) {
                    var tmp = lst[i].selected;
                    if (tmp) {
                        toggle = true;
                    } else {
                        toggle = false;
                        break;
                    }
                    var k = lst[i];
                    k.completed = chkboxvalue;
                    k.selected = chkboxvalue;
                }
            }
            if (toggle) {
                headcbb.checked = true;
            }
        } else {
            item.completed = chkboxvalue;
            headcbb.checked = chkboxvalue;
        }
    }




}

//=========================================================
@Component({
    selector: 'todocomp',
    directives: [ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS],
    template: '<h4>TODO List</h4>\
    <ul>\
       <li *ngFor="let item of todoSrvc.todolist">\
           <span [class.completed]="item.completed">{{ item.title }}-{{item.completed}}</span>\
           <button (click)="completeTask(item)">Click to complete</button>\
       </li>\
    </ul>',
    styles: [".completed {color:green}"]
})
export class TodoComponent implements OnInit {
    constructor(public todoSrvc: TodoService) { }
    ngOnInit() {
        this.todoSrvc.getTodoList();
    }
    completeTask(item) {
        item.completed = true;
    }
}
//=========================================================
@Component({
    selector: 'rbi-app',
    directives: [TodoNewComponent, TodoComponent, ROUTER_DIRECTIVES],
    providers: [ROUTER_PROVIDERS, TodoService],
    template: '<div class="container"><h4><strong>TODO List Application</strong></h4>\
                          <todocomp-new (eventEmitterDoubleClick)="receiveEvent($event)"></todocomp-new>\
                      </div>'
})
export class AppComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
    receiveEvent(event) {
      //  console.log('DoubleClick event from ');
        //console.log(event);
    }
}
