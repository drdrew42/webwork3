package DB::Schema::Result::ProblemSet::HWSet;

use strict;
use warnings;
use feature 'signatures';
no warnings qw(experimental::signatures);

use base qw(DB::Schema::Result::ProblemSet DB::Validation);

=head1 DESCRIPTION

This is the database schema for a HWSet, a subclass of a C<DB::Schema::Result::ProblemSet>

In particular, this contains the methods C<validation>, C<required>,
and C<additional_validation>.  See C<DB::Validation>
for details on these.

=cut

=head2 C<validation>

subroutine that returns a hash of the validation for both set_dates and set_params.

=cut

sub validation ($self, %args) {
	if ($args{field_name} eq 'set_dates') {
		return {
			open                   => q{\d+},
			reduced_scoring        => q{\d+},
			due                    => q{\d+},
			answer                 => q{\d+},
			enable_reduced_scoring => 'bool'
		};
	} elsif ($args{field_name} eq 'set_params') {
		return {
			hide_hint       => 'bool',
			hardcopy_header => q{.*},
			set_header      => q{.*},
			description     => q{.*}
		};
	} else {
		return {};
	}
}

=pod

=head2 additional_validation

subroutine that checks any additional validation

=cut
use Data::Dumper;
sub additional_validation ($self, %args) {
	return 1 if ($args{field_name} ne 'set_dates');
	# print Dumper 'in ProblemSet::HWSet::additional_validation';

	# If a merged_dates is passed in it came from the UserSet as a merged date
	# otherwise, pull the dates from the set_dates field.
	my $dates = $args{merged_dates} // $self->get_inflated_column('set_dates');
	# print Dumper $dates;
	if ($dates->{enable_reduced_scoring}) {
		DB::Exception::ImproperDateOrder->throw(message => 'The dates are not in order')
			unless $dates->{open} <= $dates->{reduced_scoring}
			&& $dates->{reduced_scoring} <= $dates->{due}
			&& $dates->{due} <= $dates->{answer};
	} else {
		DB::Exception::ImproperDateOrder->throw(message => 'The dates are not in order')
			unless $dates->{open} <= $dates->{due}
			&& $dates->{due} <= $dates->{answer};
	}
	return 1;
}

=head2 C<required>

subroutine that returns the array for required set_dates or set_params (none)

=cut

sub required ($self, %args) {
	if ($args{field_name} eq 'set_dates') {
		return { '_ALL_' => [ 'open', 'due', 'answer' ] };
	} else {
		return {};
	}
}

1;
