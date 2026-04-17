import fs from "fs";
import csv from "csv-parser";

export class ImportService {
  async importFromCsv(
    filePath: string,
    model: any,
    entityType: string,
    owner: string
  ): Promise<{
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    message: string;
  }> {

    return new Promise<{
      totalProcessed: number;
      successCount: number;
      errorCount: number;
      message: string;
    }>((resolve, reject) => {
      const results: any[] = [];

      //reads the csv file
      fs.createReadStream(filePath)
        .pipe(csv({ separator: "," }))

        //process each row directly
        .on("data", (row) => {
          try {
            const transformed = this.transformRow(row, entityType, owner);
            if (transformed) {
              results.push(transformed);
            }
          } catch (err) {
            console.error("Row error:", err);
          }
        })

        //saving data
        .on("end", async () => {
          try {
            let successCount = 0;
            let errorCount = 0;

            if (results.length > 0) {
              try {
                await model.bulkCreate(results);
                successCount = results.length;
              } catch (bulkError: any) {
                console.error("Bulk create error:", bulkError);
                // Try individual inserts if bulk fails
                for (const item of results) {
                  try {
                    await model.create(item);
                    successCount++;
                  } catch (individualError: any) {
                    console.error("Individual insert error:", individualError);
                    errorCount++;
                  }
                }
              }
            }

            resolve({
              totalProcessed: results.length + errorCount,
              successCount,
              errorCount,
              message: `Processed ${results.length + errorCount} rows. Successfully imported ${successCount} records. ${errorCount > 0 ? `${errorCount} rows had errors and were skipped.` : ''}`
            });
          } catch (err) {
            reject(err);
          }
        })

        .on("error", reject);
    });
  }

  //transformation 
  private transformRow(row: any, entityType: string, owner: string) {
    const baseData = {
      owner,
      createdBy: owner
    };

    // Validate required fields based on entity type
    switch (entityType) {
      case 'lead':
        if (!row.name || !row.email) {
          console.warn('Skipping row - missing required fields (name or email):', row);
          return null;
        }
        return {
          ...baseData,
          name: row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
          email: row.email,
          phone: row.phone,
          company: row.company,
          jobTitle: row.jobTitle,
          status: row.status || 'New',
          value: parseFloat(row.value) || 0,
          source: row.source || 'CSV Import',
          assignedTo: row.assignedTo || '',
          lastContact: row.lastContact ? new Date(row.lastContact) : null
        };

      case 'company':
        if (!row.name) {
          console.warn('Skipping row - missing required field (name):', row);
          return null;
        }
        return {
          ...baseData,
          name: row.name,
          industry: row.industry,
          type: row.type || 'Private',
          phone: row.phone,
          city: row.city,
          country: row.country,
          employees: parseInt(row.employees) || 0,
          revenue: parseFloat(row.revenue) || 0,
          domain: row.domain
        };

      case 'deal':
        if (!row.name) {
          console.warn('Skipping row - missing required field (name):', row);
          return null;
        }
        return {
          ...baseData,
          name: row.name,
          stage: row.stage || 'Prospecting',
          amount: parseFloat(row.amount) || 0,
          closeDate: row.closeDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          priority: row.priority || 'medium',
          associatedLead: row.associatedLead || null
        };

      case 'ticket':
        if (!row.title) {
          console.warn('Skipping row - missing required field (title):', row);
          return null;
        }
        return {
          ...baseData,
          title: row.title,
          description: row.description,
          status: row.status || 'New',
          priority: row.priority || 'medium',
          source: row.source || 'Email'
        };

      default:
        return baseData;
    }
  }
}
