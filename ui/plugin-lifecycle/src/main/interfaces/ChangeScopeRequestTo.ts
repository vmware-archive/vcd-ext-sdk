import { Observable } from "rxjs";
import { Response} from "@angular/http";

export interface ChangeScopeRequestTo {
    url: string;
    req: Observable<Response>;
}
