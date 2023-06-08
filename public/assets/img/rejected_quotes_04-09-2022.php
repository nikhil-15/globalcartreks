<?php $pgname = "quote-management";
$spgname = "rejected-quotes";
  
?>  
    <div class="br-mainpanel">      
      <div class="br-pagebody">
        <div class="row row-sm">
            <div class='trip_management_tab'>
                <ul class="project-tab mg-t-20">
                  <li><a href="<?= base_url('new_quote') ?>">New Quotation Requests</a></li>
                  <li><a href="<?= base_url('submitted_quote');?>">Submitted Quotation</a></li>
                  <li><a href="<?= base_url('won_quotes')?>">Won Quotation</a></li>
                  <li class="active"><a href="<?= base_url('rejected_quotes')?>">Rejected Quotation</a></li>
                  <li><a href="<?= base_url('inactive_quotations')?>">In-Active Quotation</a></li>
                </ul>
            </div>
            
        <?php if(($get_rejected_quote_data)): 
        foreach ($get_rejected_quote_data as $value): ?>
          <div class="col-lg-6 mg-b-20">
            <div class="card bd-0 rounded overflow-hidden blue-shadow reject-quote-card">
              <div class="card-body pd-x-15 pd-b-25">
                <div class="bd-0 table-responsive">
                  <table class="table mg-b-0 cdetails-table">
                    <tbody>
                      <tr>
                        <th scope="row">Trip Title :</th>
                        <td><?= $value['utitle']?></td>
                      </tr>
                      <tr>
                        <th scope="row">Additional Details/Questions :</th>
                        <td class="detailsOverflow"><?= $value['udesc']?></td>
                      </tr>
                      <tr>
                        <th scope="row">No. of People : </th>
                        <td><?= $value['upeople']?></td>
                      </tr>                    
                        <tr>
                          <th scope="row">No. of Luggage :</th>
                          <td><?= $value['uluggage']?></td>
                        </tr>
                      <tr>
                        <th scope="row">Start Date :</th>
                        <td><?= date("D, M j, Y", strtotime($value['ustart'])); ?></td>
                      </tr>
                      <tr>
                        <th scope="row">End Date : </th>
                        <td><?= date("D, M j, Y", strtotime($value['uend'])); ?></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="card-footer pd-10 tx-right  bg-transparent">
                <!--<a  class="btn btn-oblong <?//= ($value['status']=='1')?'btn-danger not-interested':'btn-info' ?> tx-semibold mg-r-5 "><?//= ($value['status']=='1')?'Cancelled Quotation':'Rejected Quotation' ?></a>-->
              </div>
          
            </div>
          </div>
        <?php  endforeach; endif; ?>
            
        <?php if(!empty($not_intrested)): 
        foreach ($not_intrested as $value): ?>
          <div class="col-lg-6 mg-b-20">
            <div class="card bd-0 rounded overflow-hidden blue-shadow reject-quote-card">
              <div class="card-body pd-x-15 pd-b-25">
                <div class="bd-0 table-responsive">
                  <table class="table mg-b-0 cdetails-table">
                    <tbody>
                      <tr>
                        <th scope="row">Trip Title :</th>
                        <td ><?= $value['utitle']?></td>
                      </tr>
                      <tr>
                        <th scope="row">Additional Details/Questions :</th>
                        <td class="detailsOverflow"><?= $value['udesc']?></td>
                      </tr>
                      <tr>
                        <th scope="row">No. of People : </th>
                        <td><?= $value['upeople']?></td>
                      </tr>                    
                        <tr>
                          <th scope="row">No. of Luggage :</th>
                          <td><?= $value['uluggage']?></td>
                        </tr>
                      <tr>
                        <th scope="row">Start Date :</th>
                        <td><?= date("D, M j, Y", strtotime($value['ustart'])); ?></td>
                      </tr>
                      <tr>
                        <th scope="row">End Date : </th>
                        <td><?= date("D, M j, Y", strtotime($value['uend'])); ?></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="card-footer pd-10 tx-right  bg-transparent">
                <!--<a  class="btn btn-oblong btn-danger tx-semibold mg-r-5 ">Cancelled Quotation</a>-->
              </div>
          
            </div>
          </div>
        <?php  endforeach;endif;?>
        <?php if( (($get_rejected_quote_data) == null) && ($not_intrested) == null): ?>
            <!--<p>rejected quotes not available</p>-->
            <div class="dnf"><p>No data found</p></div>
            <?php endif; ?>
        
            
            
            
            
<!--          <div class="col-lg-12 mg-b-20">
            <nav aria-label="Page navigation">
                <ul class="pagination pagination-basic mg-b-0">
                  <li class="page-item active"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item">
                    <a class="page-link" href="#" aria-label="Last">
                      <i class="fa fa-angle-double-right"></i>
                    </a>
                  </li>
                </ul>
              </nav>
          </div>-->
        </div>
      </div>      
