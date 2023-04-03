import { Injectable } from '@nestjs/common';
import { JSDOM } from 'jsdom';

import { DepartmentError, Position } from '../types';

@Injectable()
export class GetDepartmentService {
  public static URL = 'https://www.actian.com/company/careers';

  public static JOB_WRAPPER_SELECTOR = '.lever-jobs-wrapper';
  public static DEPT_NAME_SELECTOR = '.department';
  public static LISTING_SELECTOR = '.listing';
  public static JOB_NAME_SELECTOR = '.job-name';
  public static JOB_LOCATION_SELECTOR = '.job-position';

  /**
   * @method get
   * @param department
   */
  async get(department: string): Promise<Position[] | DepartmentError> {
    const response = await fetch(GetDepartmentService.URL);
    const page = await response.text();
    if (page) {
      const {
        window: { document },
      } = new JSDOM(page);
      const departments = document.querySelector(
        GetDepartmentService.JOB_WRAPPER_SELECTOR,
      );
      if (departments) {
        const name = department.replace(/-/g, ' ').trim();
        const element = this.#getDepartment(name, departments.children);
        if (element) {
          const positions = this.#getPositions(
            element.querySelectorAll(GetDepartmentService.LISTING_SELECTOR),
          );
          if (positions.length) {
            return positions;
          }
        }
      }
    }
    return DepartmentError.NoDepartmentFound;
  }

  #getPositions(listings: NodeListOf<HTMLElement>): Position[] {
    return Array.from(listings)
      .map((listing) => {
        const jobNameElement = listing.querySelector(
          GetDepartmentService.JOB_NAME_SELECTOR,
        );
        const jobLocationElement = listing.querySelector(
          GetDepartmentService.JOB_LOCATION_SELECTOR,
        );
        if (jobNameElement && jobLocationElement) {
          return {
            title: jobNameElement.textContent,
            location: jobLocationElement.textContent,
          };
        }
        return null;
      })
      .filter((position) => position !== null);
  }

  #getDepartment(name: string, departments: HTMLCollection): Element | null {
    for (const child of departments) {
      const dept = child.querySelector(GetDepartmentService.DEPT_NAME_SELECTOR);
      if (dept) {
        const deptName = dept.textContent?.trim().toLowerCase();
        if (name.toLowerCase() === deptName) {
          return child;
        }
      }
    }
    return null;
  }
}
